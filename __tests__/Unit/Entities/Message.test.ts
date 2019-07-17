import { Message } from "../../../src/Entities";

class FooMessage extends Message {
    public constructor(
        private readonly sS: string,
        private readonly nN: number,
        private readonly bB: boolean,
        private readonly mS: FooMessage[],
        private readonly dD: Date,
    ) {
        super();
    }
}

describe("Message", () => {
    it("stringifies message", () => {
        // given
        const date = new Date();
        const message = new FooMessage(
            "text",
            10,
            true,
            [new FooMessage("foobar", 0, false, [], date)],
            date,
        );

        // when
        const body = JSON.stringify(message);

        // then
        expect(JSON.parse(body)).toEqual({
            s_s: "text",
            n_n: 10,
            b_b: true,
            m_s: [{ s_s: "foobar", n_n: 0, b_b: false, m_s: [], d_d: date.toISOString() }],
            d_d: date.toISOString(),
        });
    });
});
