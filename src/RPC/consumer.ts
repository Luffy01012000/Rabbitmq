import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function recMail() {
  try {
    const queueName = "rpc_queue";
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    // Assert the queue
    await channel.assertQueue(queueName,{durable:false, });
   channel.prefetch(1);

    console.log("Listening for messages in RPC_queue...");

    // Consume messages
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const n = parseInt(msg.content.toString()); // Convert Buffer to string then integer
        console.log(" [.] fib(%d)", n);
        const r = fibonacci(n);
        channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(r.toString()), {
              correlationId: msg.properties.correlationId
            });
        channel.ack(msg); // Acknowledge the message
      }
    }, { noAck: false }); // Ensure manual acknowledgment
  } catch (error) {
    console.error("Error in mail consumer:", error);
  }
}

function fibonacci(n:number):number {
    if (n == 0 || n == 1)
      return n;
    else
      return fibonacci(n - 1) + fibonacci(n - 2);
  }

// Run the consumer
recMail().catch((error) => {
  console.error("Consumer failed:", error);
});

