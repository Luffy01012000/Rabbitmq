import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function sendNotificationMsg(headers:{},message:string) {

    try {
        const exchange = "header_exchange";
        const exchangeType = "headers";
        

        const connection = await getRabbitMQConnection();
        const channel = await getRabbitMQChannel(connection);

        await channel.assertExchange(exchange,exchangeType);
        
        channel.publish(exchange,"",Buffer.from(message),{
            persistent:true,
            headers
        });
        console.log("published!");

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

sendNotificationMsg({
    "x-match": "all",
    "notification-type":"new_video",
    "content-type":"video"
},"New music video uploaded")
sendNotificationMsg({
    "x-match": "all",
    "notification-type":"live_stream",
    "content-type":"gaming"
},"Gaming live stream started")
sendNotificationMsg({
    "x-match": "any",
    "notification-type-comment":"comment",
    "content-type":"vlog"
},"New comment on your vlog")
// sendNotificationMsg({
//     "x-match": "any",
//     "notification-type-like":"like",
//     "content-type":"vlog"
// },"Someone like on your vlog")