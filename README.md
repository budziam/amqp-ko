# AMQP Kø [![CircleCI](https://circleci.com/gh/budziam/amqp-ko.svg?style=svg)](https://circleci.com/gh/budziam/amqp-ko)
Object oriented AMQP layer for microservices communication.

## Usage
The recommended way to use Kø is to create your own queue object. The simplest way to do this is using `createQueue` function.

### Create queue
```js
import { createQueue } from "amqp-ko";

class TopicFollow {
    constructor(userId, topicName) {
        this.userId = userId;
        this.topicName = topicName;
    }
}

class TopicFollowUnmarshaller {
    unmarshal(data) {
        return new TopicFollow(data.user_id, data.topic_name);
    }
}

const messageGates = [
    new MessageGate("topic_follow", TopicFollow, new TopicFollowUnmarshaller()),
];

const queue = createQueue("localhost", 5672, "rabbitmq", "rabbitmq", "exchange-name", messageGates);
```

### Consume messages
```js
export class ConnectUserWithTopic {
    async consume(job) {
        // Connect user with a topic using "job.message.userId" and "job.message.topicName"
        await job.ack();
    }
}

queue.consume(
    "queue-name",
    new Map([
        [TopicFollow, new ConnectUserWithTopic()],
    ]),
);
```

### Produce messages
```js
const message = new TopicFollow(120, "entertainment");
queue.produce(message);
```
