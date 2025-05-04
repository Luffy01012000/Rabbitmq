import {getRabbitMQConnection,getRabbitMQChannel} from "../index";

async function sendToDelayedQueue(batchId:string,orders:unknown,delay:number) {
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);

    const exchange = "delayed_queue";

    await channel.assertExchange(exchange,"x-delayed-message",{
        arguments: {"x-delayed-type": "direct"}
    });
    
    const queueName = "delayed_order_updates_queue";
    await channel.assertQueue(queueName,{durable:true});
    await channel.bindQueue(queueName,exchange,"");

    const message = JSON.stringify({batchId,orders});
    channel.publish(exchange,"", Buffer.from(message),{
        headers: {"x-delay": delay},
    });

    console.log(`sent Batch ${batchId} update task to delayed queue with ${delay} sec delay.`);

    await channel.close();
    await connection.close();
}

async function processBatchOrder(delay:number) {
    const batchId = generateBatch();
    const orders = collectionOrdersForBatch();

    console.log(`processing batch ${batchId} with orders: ${JSON.stringify(orders)}`);

    // update inventory, generate shipping labels, etc.
    await processOrders(orders);

    // const delay = 10000; //10sec
    sendToDelayedQueue(batchId, orders, delay);
}

function generateBatch() {
    return "batch-"+ Date.now();
}

function collectionOrdersForBatch() {
    return [
        {orderId: 1, item: "Laptop",quantity: 1},
        {orderId: 2, item: "phone",quantity: 2},

    ]
}

async function processOrders(orders:unknown) {
    console.log('Inventory updated')
    return;
}


processBatchOrder(10*1000);
processBatchOrder(20*1000);