export type Message = object;
export type MessageConstructor<T extends Message = Message> = new (...args: any[]) => T;
