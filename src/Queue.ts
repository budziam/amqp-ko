import { QueueConnection } from "./QueueConnection";
import { Consumer, Job } from "./Entities";
import { Channel, Message as IncomingMessage } from "amqplib";
import { MessageGateCollection } from "./MessageGateCollection";
import { getHeaderValue, marshal, randomInt } from "./utils";
import { Message, MessageConstructor } from "./types";
import { InvalidMessageTypeException, InvalidRoutingKeyException } from "./Exceptions";
import logger from "./logger";

const TYPE_X_DELAYED_MESSAGE = "x-delayed-message";
const HEADER_X_DELAY = "x-delay";
const HEADER_X_ATTEMPTS = "x-attempts";
const DELIVERY_PERSISTENT = 2;
const MAX_DELAY_SECONDS = 30 * 60;

const calculateRequeueBackoff = (message: IncomingMessage): number => {
    const attempts = getHeaderValue(message, HEADER_X_ATTEMPTS, 1);
    const delay = randomInt(1, 2 ** (3 + Number(attempts)));
    return Math.min(MAX_DELAY_SECONDS, delay) * 1000;
};

const findConsumer = (
    consumers: Map<MessageConstructor, Consumer>,
    messageType: MessageConstructor,
) => {
    if (consumers.has(messageType)) {
        return consumers.get(messageType);
    }

    throw new InvalidMessageTypeException(messageType);
};

export class Queue {
    private readonly exchangeName: string;
    private readonly delayExchangeName: string;
    private _channel?: Channel;

    public constructor(
        private readonly connection: QueueConnection,
        private readonly messageGates: MessageGateCollection,
        private readonly prefetchCount: number,
        exchange: string,
    ) {
        this.connection = connection;
        this.exchangeName = exchange;
        this.delayExchangeName = `${exchange}_delayed`;
        this.messageGates = messageGates;
    }

    public async produce(message: Message): Promise<boolean> {
        const gate = this.messageGates.getByMessageType(message.constructor as MessageConstructor);
        const routingKey = gate.routingKey;
        const body = Buffer.from(JSON.stringify(marshal(message)));

        const channel = await this.channel();
        return channel.publish(this.exchangeName, routingKey, body, {
            deliveryMode: DELIVERY_PERSISTENT,
        });
    }

    public async consume(
        queueName: string,
        consumers: Map<MessageConstructor, Consumer>,
    ): Promise<void> {
        const channel = await this.channel();
        await channel.assertExchange(this.exchangeName, "topic", { durable: true });
        await channel.assertQueue(queueName, { durable: true });

        for (const messageType of consumers.keys()) {
            const gate = this.messageGates.getByMessageType(messageType);
            await channel.bindQueue(queueName, this.exchangeName, gate.routingKey);
        }

        await channel.consume(queueName, async message => this.processMessage(message, consumers));
    }

    public async requeue(message: IncomingMessage): Promise<void> {
        await this.requeueLater(message, calculateRequeueBackoff(message));
    }

    public async requeueLater(message: IncomingMessage, delay: number): Promise<void> {
        const channel = await this.channel();
        await channel.assertExchange(this.exchangeName, "topic", { durable: true });
        await channel.assertExchange(this.delayExchangeName, TYPE_X_DELAYED_MESSAGE, {
            durable: true,
            arguments: {
                "x-delayed-type": "fanout",
            },
        });

        await channel.bindExchange(this.exchangeName, this.delayExchangeName, "");

        const options = {
            deliveryMode: DELIVERY_PERSISTENT,
            headers: {
                [HEADER_X_DELAY]: delay,
                [HEADER_X_ATTEMPTS]: Number(getHeaderValue(message, HEADER_X_ATTEMPTS, 1)) + 1,
            },
        };

        // Publish message with a given delay. Next reject old message
        // otherwise we would end up with loosing a message.
        await channel.publish(
            this.delayExchangeName,
            message.fields.routingKey,
            message.content,
            options,
        );
        channel.reject(message, false);

        logger.info("Message was requeued", {
            msg_routing_key: message.fields.routingKey,
            msg_body: message.content.toString(),
            msg_attempts: options.headers[HEADER_X_ATTEMPTS],
            msg_delay: options.headers[HEADER_X_DELAY],
        });
    }

    public async ack(message: IncomingMessage): Promise<void> {
        const channel = await this.channel();
        channel.ack(message);
    }

    public async nack(message: IncomingMessage): Promise<void> {
        const channel = await this.channel();
        channel.nack(message);
    }

    private async processMessage(
        incomingMessage: IncomingMessage,
        consumers: Map<MessageConstructor, Consumer>,
    ): Promise<void> {
        let consumer: Consumer;
        let job: Job;

        try {
            const gate = this.messageGates.getByRoutingKey(incomingMessage.fields.routingKey);
            consumer = findConsumer(consumers, gate.messageType);
            const body = JSON.parse(incomingMessage.content.toString());
            const message = gate.unmarshaller.unmarshal(body);
            job = new Job(this, incomingMessage, message);
        } catch (e) {
            if (
                e instanceof InvalidRoutingKeyException ||
                e instanceof InvalidMessageTypeException
            ) {
                return this.handleInvalidMessage(incomingMessage);
            }

            logger.error(e);
            logger.error("Could not unserialize message", {
                msg_routing_key: incomingMessage.fields.routingKey,
                msg_body: incomingMessage.content.toString(),
                msg_attempts: getHeaderValue(incomingMessage, HEADER_X_ATTEMPTS, 1),
            });
            await this.requeue(incomingMessage);
        }

        try {
            await consumer.consume(job);
        } catch (e) {
            logger.error(e);
            logger.error("Could not consume message", {
                msg_routing_key: incomingMessage.fields.routingKey,
                msg_body: incomingMessage.content.toString(),
                msg_attempts: getHeaderValue(incomingMessage, HEADER_X_ATTEMPTS, 1),
            });
            // Job could be requeued in a consume method, so we need to
            // use job requeue method to ensure we would not requeue it twice
            await job.requeue();
        }
    }

    private async handleInvalidMessage(incomingMessage: IncomingMessage): Promise<void> {
        logger.warn("Received invalid message", {
            msg_routing_key: incomingMessage.fields.routingKey,
            msg_body: incomingMessage.content.toString(),
        });

        await this.ack(incomingMessage);
    }

    private async channel(): Promise<Channel> {
        if (this._channel === undefined) {
            const connection = await this.connection.connection();
            const channel = await connection.createChannel();
            await channel.prefetch(this.prefetchCount);
            this._channel = channel;
        }

        return this._channel;
    }
}
