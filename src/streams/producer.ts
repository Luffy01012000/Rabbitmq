import {getRabbitMQConnection,getRabbitMQChannel} from "../index";

async function sendToStreamQueue(message:string) {
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);
    try {
    
        const queueName = "stream_queue";
        // const exchangeName = "stream_exchange";
        // const routingKey = "stream_key";
    
        // await channel.assertExchange(exchangeName,"direct",{durable:true})
        await channel.assertQueue(queueName,{durable:true,
            arguments:{
                "x-queue-type": "stream",
            }
        });
    
            // channel.publish(queueName,"", Buffer.from(message),{ persistent: true });
            channel.sendToQueue(queueName, Buffer.from(message), { persistent: true })
    
    
        // await channel.close();
    } catch (error) {
        console.log(error)
    }finally {
        if (channel) await channel.close();
        if(connection) await connection.close();
      }
}

async function sendToStreamQueuewithExchange(message:string) {
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);
    try {
    
        const queueName = "stream_queue";
        const exchangeName = "stream_exchange";
        const routingKey = "stream_key";
    
        await channel.assertExchange(exchangeName,"direct",{durable:true})
        await channel.assertQueue(queueName,{durable:true,
            arguments:{
                "x-queue-type": "stream",
            }
        });
    
        await channel.bindQueue(queueName, exchangeName, routingKey);
            channel.publish(exchangeName,routingKey, Buffer.from(message),{ persistent: true });
    
    
        // await channel.close();
    } catch (error) {
        console.log(error)
    }finally {
        if (channel) await channel.close();
        if(connection) await connection.close();
      }
}

// sendToStreamQueue("hello from stream");       
sendToStreamQueuewithExchange("hello from stream");       
    