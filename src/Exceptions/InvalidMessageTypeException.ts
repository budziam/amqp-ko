import { MessageType } from "../types";

export class InvalidMessageTypeException extends Error {
    public constructor(messageType: MessageType) {
        super(`Invalid message type: [${messageType}]`);
    }
}
