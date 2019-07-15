import { createQueue, MessageGate, Queue } from "../../src";

class TopicFollow {
    public constructor(public readonly userId, public readonly topicName) {
        //
    }
}

class TopicFollowUnmarshaller {
    public unmarshal(data: any): TopicFollow {
        return new TopicFollow(data.user_id, data.topic_name);
    }
}

describe("factory", () => {
    it("create queue object", () => {
        // given
        const messageGates = [
            new MessageGate("topic_follow", TopicFollow, new TopicFollowUnmarshaller()),
        ];

        // when
        const queue = createQueue(
            "localhost",
            5672,
            "rabbitmq",
            "rabbitmq",
            "exchange-name",
            messageGates,
        );

        // then
        expect(queue).toBeInstanceOf(Queue);
    });
});
