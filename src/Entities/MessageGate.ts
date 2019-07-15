import { Unmarshaller } from "./Unmarshaller";
import { MessageType } from "../types";

export class MessageGate {
    public constructor(
        public readonly routingKey: string,
        public readonly messageType: MessageType,
        public readonly unmarshaller: Unmarshaller,
    ) {
        //
    }
}
