export type Message = object;
export type MessageType = new (...args: any[]) => Message;
