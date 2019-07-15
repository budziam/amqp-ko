import { Job } from "./Job";

export interface Consumer {
    consume(job: Job): Promise<void>;
}
