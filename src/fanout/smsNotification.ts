import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function recMail() {
  try {
    const exchange = "new_product_launched";
    const exchangeType = "fanout";
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    // Assert the queue
    await channel.assertExchange(exchange,exchangeType,{durable:true});
    const q = await channel.assertQueue("",{exclusive:true});
    
    await channel.bindQueue(q.queue,exchange,"");
    console.log("Listening for messages in order_queue...");

    // Consume messages
    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString(); // Convert Buffer to string
        // console.log(`Received message: ${messageContent}`);
        try {
          const parsedMessage = JSON.parse(messageContent); // Parse if JSON
          console.log("[SMS Notification] Msg was consumed!:", parsedMessage);
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