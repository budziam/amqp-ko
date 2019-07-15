export class InvalidRoutingKeyException extends Error {
    public constructor(routingKey: string) {
        super(`Invalid routing key: [${routingKey}]`);
    }
}
