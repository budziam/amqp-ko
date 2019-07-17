import { MessageConstructor } from "../Entities";

export class InvalidMessageTypeException extends Error {
    public constructor(messageType: MessageConstructor) {
        super(`Invalid message type: [${messageType}]`);
    }
}
