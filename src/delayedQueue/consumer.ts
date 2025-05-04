import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function recMail() {
  try {
    
    const queueName = "delayed_order_updates_queue";
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    // Assert the queue
   const q = await channel.assertQueue(queueName,{durable:true});
   

    console.log("Listening for messages in order_queue...");

    // Consume messages
    channel.consume(queueName, (batch) => {
      if (batch !== null) {
        const messageContent = batch.content.toString(); // Convert Buffer to string
        // console.log(`Received message: ${messageContent}`);
        try {
          const {batchId,orders} = JSON.parse(messageContent); // Parse if JSON
          console.log("[Processing order] update task for batch:",batchId);
          updateOrderStatuses(batchId,orders);
        } catch (error) {
          console.error("Failed to parse message as JSON:", error);
        }
        channel.ack(batch); // Acknowledge the message
      }
    }, { noAck: false }); // Ensure manual acknowledgment
  } catch (error) {
    console.error("Error in mail consumer:", error);
  }
}

function updateOrderStatuses(batchId:string,orders:{}){
    return setTimeout(()=>console.log(`Order status updated to "Started Shipping" for batch id ${batchId}\n`,orders),6000);
}

// Run the consumer
recMail().catch((error) => {
  console.error("Consumer failed:", error);
});

