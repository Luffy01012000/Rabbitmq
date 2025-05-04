import type { ConsumeMessage } from "amqplib";
import {getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function recMail() {
  try {
    const exchange = "notification_exchange";
    const queueName = "payment_queue";
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    // Assert the queue
    await channel.assertExchange(exchange,"topic", { durable: true });
    await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(queueName, exchange,"payment.*");

    console.log("Listening for messages in mail_queue for subscribed user...");

    // Consume messages
    channel.consume(queueName, (msg: ConsumeMessage | null) => {
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