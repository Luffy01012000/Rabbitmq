import { getRabbitMQConnection, getRabbitMQChannel } from "./index";

async function sendMail(queueName:string,routingKey:string,message:unknown) {

    try {
        // const queueName1 = "user_mail_queue";
        // const queueName2 = "subscribed_user_mail_queue";
        // const routingKey1 = "send_mail_to_user";
        // const routingKey2 = "send_mail_to_subscribed_user";

        // const message1 = {
        //     to: "summit@example.com",
        //     from: "rutvik@example.com",
        //     subject: "msg 1",
        //     body: "updated testing of rabbitmq",
        // };

        // const message2 = {
        //     to: "summit@example.com",
        //     from: "rutvik@example.com",
        //     subject: "msg 2",
        //     body: "updated Thank you for subscribing to rabbitmq",
        // };

        const connection = await getRabbitMQConnection();
        const channel = await getRabbitMQChannel(connection);

        const exchange = "mail_exchange";

        await channel.assertExchange(exchange,"direct");

        await channel.assertQueue(queueName,{durable:false});

        await channel.bindQueue(queueName,exchange,routingKey);
        
        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)),{persistent:true});
        console.log("[x] Sent '%s':'%s'",routingKey,JSON.stringify(message));
        
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

sendMail("user_mail_queue","send_mail_to_user",{
    to: "summit@example.com",
    from: "rutvik@example.com",
    subject: "msg 1",
    body: "updated testing of rabbitmq",
});

sendMail("subscribed_user_mail_queue","send_mail_to_subscribed_user",{
    to: "summit@example.com",
    from: "rutvik@example.com",
    subject: "msg 2",
    body: "updated Thank you for subscribing to rabbitmq",
});
