import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function sendNotificationMsg(routingKey:string,message:unknown) {

    try {
        const exchange = "notification_exchange";
        const exchangeType = "topic";
        

        const connection = await getRabbitMQConnection();
        const channel = await getRabbitMQChannel(connection);

        await channel.assertExchange(exchange,exchangeType);
        
        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)));
        
        setTimeout(()=>{
            connection.close();
        },5000)
    } catch (error) {
        if(error instanceof Error){
            console.log(`Error in mail sending..\nmessage:${error.message}\nStack: ${error.stack}`)
        }else{
            console.log(`Error in mail sending..\n${error}`)
        }
    }
    
}

sendNotificationMsg("order.placed",{orderId: 1234,status:"placed"})
sendNotificationMsg("payment.processed",{paymentId: 56789,status:"processed"})