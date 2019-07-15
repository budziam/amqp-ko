export class KeyRenamer {
    public constructor(private readonly renamer: (key: string) => string) {
        //
    }

    public deep(toRename: any): any {
        if (Array.isArray(toRename)) {
            return this.renameArray(toRename);
        }

        if (toRename instanceof Object) {
            return this.renameObject(toRename);
        }

        return toRename;
    }

    private renameObject(toRename: object): object {
        const output = {};

        for (const [key, value] of Object.entries(toRename)) {
            output[this.renamer(key)] = this.deep(value);
        }

        return output;
    }

    private renameArray(toRename: any[]): any[] {
        return toRename.map(item => this.deep(item));
    }
}
