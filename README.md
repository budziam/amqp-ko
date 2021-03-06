# AMQP Kø [![CircleCI](https://circleci.com/gh/budziam/amqp-ko.svg?style=svg)](https://circleci.com/gh/budziam/amqp-ko)
Object oriented AMQP layer for microservices communication.

## Usage
The recommended way to use AMQP Kø is to create your own queue object. The simplest way to do this is using `createQueue` function.

### Create queue
```js
import { createQueue, Message } from "amqp-ko";

class TopicFollow extends Message {
    constructor(userId, topicName) {
        super();
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
class ConnectUserWithTopic {
    async consume(job) {
        // Put here some code to connect user with a topic
        // using "job.message.userId" and "job.message.topicName"
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

## Installation
```bash
yarn add amqp-ko
```
```bash
npm install amqp-ko
```

## Run tests
All of the AMQP Kø tests are written with jest. They can be run with yarn
```bash
yarn test
```

#### Author: [Michał Budziak]

[Michał Budziak]: http://github.com/budziam
