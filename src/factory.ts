import { Queue } from "./Queue";
import { MessageGate } from "./Entities";
import { QueueConnection } from "./QueueConnection";
import { MessageGateCollection } from "./MessageGateCollection";

export const createQueue = (
    host: string,
    port: number,
    username: string,
    password: string,
    exchange: string,
    messageGates: MessageGate[],
    prefetchCount: number = 5,
): Queue => {
    const connection = new QueueConnection(host, port, username, password);
    const messageGateCollection = new MessageGateCollection(messageGates);
    return new Queue(connection, messageGateCollection, prefetchCount, exchange);
};
