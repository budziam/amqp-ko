import { MessageGate } from "./MessageGate";
import { InvalidMessageTypeException, InvalidRoutingKeyException } from "./Exceptions";
import { MessageType } from "./types";

export class MessageGateCollection {
    public constructor(private readonly messageGates: MessageGate[]) {
        //
    }

    public getByRoutingKey(routingKey: string): MessageGate {
        const messageGate = this.messageGates.find(gate => gate.routingKey === routingKey);

        if (messageGate) {
            return messageGate;
        }

        throw new InvalidRoutingKeyException(routingKey);
    }

    public getByMessageType(messageType: MessageType): MessageGate {
        const messageGate = this.messageGates.find(gate => gate.messageType === messageType);

        if (messageGate) {
            return messageGate;
        }

        throw new InvalidMessageTypeException(messageType);
    }
}
