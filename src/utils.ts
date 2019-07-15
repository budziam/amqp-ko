import moment from "moment";
import { KeyRenamer } from "./KeyRenamer";
import { Message as IncomingMessage } from "amqplib";
import snakeCase from "snake-case";
import { Message } from "./types";

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

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

export const createDate = (text: string): Date => {
    const date = new Date(text);
    date.toJSON = () => moment(date).format(DATETIME_FORMAT);
    return date;
};

export const marshal = (message: Message): string => new KeyRenamer(snakeCase).deep(message);

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
