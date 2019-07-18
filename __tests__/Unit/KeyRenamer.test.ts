import { KeyRenamer } from "../../src/KeyRenamer";
import { Message } from "../../src/Entities";

class FooMessage extends Message {
    public constructor(public readonly test: any) {
        super();
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

    it("does not rename objects", () => {
        // given
        const toRename = new FooMessage({ example: 1 });

        // when
        const renamed = new KeyRenamer(key => `a${key}`).deep(toRename);

        // then
        expect(renamed).toEqual({
            atest: {
                example: 1,
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
