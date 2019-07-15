import { Message } from "../types";

export interface Unmarshaller {
    unmarshal(data: any): Message;
}
