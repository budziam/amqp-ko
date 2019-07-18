import { KeyRenamer } from "../KeyRenamer";
import snakeCase from "snake-case";

export type MessageConstructor<T extends Message = Message> = new (...args: any[]) => T;

export abstract class Message {
    public toJSON(): object {
        return new KeyRenamer(snakeCase).deep(this);
    }
}
