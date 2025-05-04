import { getRabbitMQConnection, getRabbitMQChannel } from "../index";

async function announceNewProduct(message:unknown) {

    try {
        const exchange = "new_product_launched";
        const exchangeType = "fanout";
        

        const connection = await getRabbitMQConnection();
        const channel = await getRabbitMQChannel(connection);

        await channel.assertExchange(exchange,exchangeType);
        
        channel.publish(exchange,"",Buffer.from(JSON.stringify(message)));
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

announceNewProduct({id: 1234,name:"iphone 19 pro max",price:200000})