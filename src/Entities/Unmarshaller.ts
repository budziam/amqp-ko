import { Message } from "../types";

export interface Unmarshaller<T extends Message = Message> {
    unmarshal(data: any): T;
}
