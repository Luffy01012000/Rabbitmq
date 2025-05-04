import {getRabbitMQConnection,getRabbitMQChannel} from "../index";

async function sendToPriorityQueue(messages:{msg:string,priority:number}[]) {
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    const exchange = "priority_exchange";
    const queueName = "priority_queue";
    const routingKey = "priority_key";

    await channel.assertExchange(exchange,"direct",{durable:true});
    
    await channel.assertQueue(queueName,{durable:true,
        arguments:{
            "x-max-priority": 10,
        }
    });
    await channel.bindQueue(queueName,exchange, routingKey);
    messages.map(msg=>{
        channel.publish(exchange,routingKey, Buffer.from(msg.msg),{
            priority: msg.priority,
        });
        console.log(`Message sent: ${msg}.`);
    })


    await channel.close();
    await connection.close();
}
const data = [
    {msg:"hello",priority:8},
    {msg:"4",priority:4},
    {msg:"queue",priority:5},
    {msg:"2",priority:2},
]
await sendToPriorityQueue(data);       
    