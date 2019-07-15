import * as winston from "winston";

const loggerName = "amqp-ko";

winston.loggers.add(loggerName, {
    transports: [new winston.transports.Console({ level: "warn" })],
});

export default winston.loggers.get(loggerName);
