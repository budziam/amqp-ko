import { KeyRenamer } from "./KeyRenamer";
import { Message as IncomingMessage } from "amqplib";
import snakeCase from "snake-case";
import { Message } from "./types";

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

export const getClass = (object: object): any => object.constructor;

export const marshal = (message: Message): string => new KeyRenamer(snakeCase).deep(message);

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
