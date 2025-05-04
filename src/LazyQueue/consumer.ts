import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function recMail() {
  try {
    const queueName = "lazy_notification_queue";

    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    // Assert the queue
   const q = await channel.assertQueue(queueName,{durable:true,
    arguments:{
      "x-queue-mode": "lazy",
    }
   });
   

    console.log("Listening for messages in lazy_queue...");

    // Consume messages
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString(); // Convert Buffer to string
        console.log(`Received message: ${messageContent}`);

        channel.ack(msg); // Acknowledge the message
      }
    }, { noAck: false }); // Ensure manual acknowledgment
  } catch (error) {
    console.error("Error in mail consumer:", error);
  }
}

// Run the consumer
recMail().catch((error) => {
  console.error("Consumer failed:", error);
});

