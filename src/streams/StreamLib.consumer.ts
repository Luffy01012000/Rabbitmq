// A stream is an append-only log abstraction that allows for repeated consumption of messages until they expire. It is a good practice to always define the retention policy. In the example above, the stream is limited to be 5 GiB in size.

import * as rabbit from "rabbitmq-stream-js-client";
// const rabbit = require("rabbitmq-stream-js-client")

async function consumeStreamQueue() {

const streamName = "lib_stream_queue"
const client = await rabbit.connect ({
    hostname: "localhost",
    port: 5552,
    username: process.env.USER as string,
    password: process.env.PSSWD as string,
    vhost: "/",
})

const streamSizeRetention = 5 * 1e9
await client.createStream({ stream: streamName, arguments: { "max-length-bytes": streamSizeRetention } });

await client.declareConsumer({ stream: streamName, offset: rabbit.Offset.first() }, (message) => {
    console.log(`Received message ${message.content.toString()}`)
})
}

consumeStreamQueue();