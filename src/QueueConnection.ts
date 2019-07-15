import { connect, Connection } from "amqplib";
import { sleep } from "./utils";
import logger from "./logger";

export class QueueConnection {
    private static readonly RECONNECT_COOLDOWN: number = 5000;
    private _connection?: Connection;

    public constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly username: string,
        private readonly password: string,
    ) {
        //
    }

    public async connection(): Promise<Connection> {
        if (!this.connected) {
            this._connection = await this.connect();
        }

        return this._connection;
    }

    public async disconnect(): Promise<void> {
        if (this.connected) {
            await this._connection.close();
            this._connection = undefined;
        }
    }

    private async connect(): Promise<Connection> {
        try {
            const connection = await connect(this.connectionUrl);
            connection.on("close", async () => this.reconnectWithDelay());
            return connection;
        } catch (e) {
            logger.warn(
                `[AMQP] Trying to connect again in ${QueueConnection.RECONNECT_COOLDOWN}ms`,
            );
            await sleep(QueueConnection.RECONNECT_COOLDOWN);
            return this.connect();
        }
    }

    private async reconnectWithDelay(): Promise<void> {
        this._connection = undefined;
        logger.info(`[AMQP] Reconnecting in ${QueueConnection.RECONNECT_COOLDOWN}ms`);
        await sleep(QueueConnection.RECONNECT_COOLDOWN);
        this._connection = await this.connect();
    }

    private get connectionUrl(): string {
        return `amqp://${this.username}:${this.password}@${this.host}:${this.port}`;
    }

    private get connected(): boolean {
        return this._connection !== undefined;
    }
}
