import { Unmarshaller } from "./Unmarshaller";
import { Message, MessageConstructor } from "../types";

export class MessageGate<T extends Message = Message> {
    public constructor(
        public readonly routingKey: string,
        public readonly messageType: MessageConstructor<T>,
        public readonly unmarshaller: Unmarshaller<T>,
    ) {
        //
    }
}
