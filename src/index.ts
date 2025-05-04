import * as amqp from "amqplib";

// Export a function that returns a Promise<amqp.Channel>
export async function getRabbitMQConnection(): Promise<amqp.ChannelModel> {
  try {
    const connection = await amqp.connect(process.env.RABBIT_URL as string);

    
    // Handle connection errors and cleanup
    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });
    connection.on("close", () => {
      console.log("RabbitMQ connection closed");
    });

    return connection;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}


export async function getRabbitMQChannel(connection:amqp.ChannelModel): Promise<amqp.Channel> {
  try {
        // return await amqp.connect(process.env.RABBIT_URL as string);
        const channel = await connection.createChannel();

    return channel;
  } catch (error) {
    console.error("Failed to create channel of RabbitMQ connection:", error);
    throw error;
  }
}


