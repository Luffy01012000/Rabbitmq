import rabbit from "rabbitmq-stream-js-client";

async function sendToStreamQueue() {
    console.log(process.env.USER)
console.log(process.env.PSSWD)

const streamName = "lib_stream_queue"
const client = await rabbit.connect({
    hostname: "localhost",
    port: 5552,
    username: process.env.USER as string,
    password: process.env.PSSWD as string,
    vhost: "/",
})

const streamSizeRetention = 5 * 1e9
await client.createStream({ stream: streamName, arguments: { "max-length-bytes": streamSizeRetention } });

const publisher = await client.declarePublisher({ stream: streamName});

await publisher.send(Buffer.from("publish streams"));
}

sendToStreamQueue();