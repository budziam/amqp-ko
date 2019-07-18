import { Message } from "./Message";

export interface Unmarshaller<T extends Message = Message> {
    unmarshal(data: any): T;
}
