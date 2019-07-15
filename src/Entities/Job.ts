import { Queue } from "../Queue";
import { Message } from "../types";
import { Message as IncomingMessage } from "amqplib";

export class Job<T extends Message = Message> {
    private processed: boolean = false;

    public constructor(
        private readonly queue: Queue,
        private readonly incomingMessage: IncomingMessage,
        public readonly message: T,
    ) {
        this.queue = queue;
        this.incomingMessage = incomingMessage;
    }

    public get body(): any {
        return JSON.parse(this.incomingMessage.content.toString());
    }

    public async ack(): Promise<void> {
        if (this.processed) {
            return;
        }

        await this.queue.ack(this.incomingMessage);
        this.processed = true;
    }

    public async nack(): Promise<void> {
        if (this.processed) {
            return;
        }

        await this.queue.nack(this.incomingMessage);
        this.processed = true;
    }

    public async requeue(): Promise<void> {
        if (this.processed) {
            return;
        }

        await this.queue.requeue(this.incomingMessage);
        this.processed = true;
    }
}
