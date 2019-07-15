import { MessageGate } from "./Entities";
import { InvalidMessageTypeException, InvalidRoutingKeyException } from "./Exceptions";
import { MessageConstructor } from "./types";

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

    public getByMessageType(messageType: MessageConstructor): MessageGate {
        const messageGate = this.messageGates.find(gate => gate.messageType === messageType);

        if (messageGate) {
            return messageGate;
        }

        throw new InvalidMessageTypeException(messageType);
    }
}
