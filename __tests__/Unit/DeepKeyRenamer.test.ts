import { KeyRenamer } from "../../src/KeyRenamer";

class FooMessage {
    public constructor(public readonly test: any) {
        //
    }
}

describe("KeyRenamer", () => {
    it("renames arrays", () => {
        // given
        const toRename = [new FooMessage("foobar"), new FooMessage("boobo")];

        // when
        const renamed = new KeyRenamer(key => `a${key}`).deep(toRename);

        // then
        expect(renamed).toEqual([{ atest: "foobar" }, { atest: "boobo" }]);
    });

    it("renames objects", () => {
        // given
        const toRename = new FooMessage({ example: 1 });

        // when
        const renamed = new KeyRenamer(key => `a${key}`).deep(toRename);

        // then
        expect(renamed).toEqual({
            atest: {
                aexample: 1,
            },
        });
    });

    it("does rename nested messages", () => {
        // given
        const toRename = new FooMessage(new FooMessage("popo"));

        // when
        const renamed = new KeyRenamer(key => `a${key}`).deep(toRename);

        // then
        expect(renamed).toEqual({
            atest: {
                atest: "popo",
            },
        });
    });
});
