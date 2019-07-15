import { Consumer } from "./Abstracts/Consumer";
import { Job } from "./Job";

export class SingleConsumer implements Consumer {
    public constructor(private readonly consumer: Consumer) {
        //
    }

    public async consume(job: Job): Promise<void> {
        await this.consumer.consume(job);
        await job.ack();
    }
}
