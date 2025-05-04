import {getRabbitMQConnection, getRabbitMQChannel } from "./index";

async function recMail() {
  try {
    const queueName = "subscribed_user_mail_queue";
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    // Assert the queue
    await channel.assertQueue(queueName, { durable: false });

    console.log("Listening for messages in mail_queue for subscribed user...");

    // Consume messages
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString(); // Convert Buffer to string
        console.log(`Received message: ${messageContent}`);
        try {
          const parsedMessage = JSON.parse(messageContent); // Parse if JSON
          console.log("Parsed message:", parsedMessage);
        } catch (error) {
          console.error("Failed to parse message as JSON:", error);
        }
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