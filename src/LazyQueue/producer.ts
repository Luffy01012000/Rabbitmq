import {getRabbitMQConnection,getRabbitMQChannel} from "../index";

async function sendToLazyQueue(message:string) {
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    const exchange = "notification_exchange";
    const queueName = "lazy_notification_queue";
    const routingKey = "notification.key";

    await channel.assertExchange(exchange,"direct",{durable:true});
    
    await channel.assertQueue(queueName,{durable:true,
        arguments:{
            "x-queue-mode": "lazy",
        }
    });
    await channel.bindQueue(queueName,exchange, routingKey);

    channel.publish(exchange,routingKey, Buffer.from(message),{
        persistent: true,
    });

    console.log(`Message sent: ${message}.`);

    await channel.close();
    await connection.close();
}

for (let index = 1; index <= 10000; index++) {
    await sendToLazyQueue(`Hello queue${index}!`);       
}
    