import { Message as IncomingMessage } from "amqplib";

export const getHeaderValue = <T>(
    message: IncomingMessage,
    key: string,
    defaultValue: any,
): any => {
    const headers = message.properties.headers || {};
    return key in headers ? headers[key] : defaultValue;
};

export const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
