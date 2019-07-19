import { Message } from "./Entities";

export class KeyRenamer {
    public constructor(private readonly renamer: (key: string) => string) {
        //
    }

    public deep(toRename: any): any {
        if (Array.isArray(toRename)) {
            return this.renameArray(toRename);
        }

        if (toRename instanceof Message) {
            return this.renameObject(toRename);
        }

        return toRename;
    }

    private renameObject(toRename: Message): object {
        const output: any = {};

        for (const [key, value] of Object.entries(toRename)) {
            output[this.renamer(key)] = this.deep(value);
        }

        return output;
    }

    private renameArray(toRename: any[]): any[] {
        return toRename.map(item => this.deep(item));
    }
}
