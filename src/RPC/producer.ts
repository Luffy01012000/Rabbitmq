import {getRabbitMQConnection,getRabbitMQChannel} from "../index";

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}
  
async function sendToRPCQueue() {
    const connection = await getRabbitMQConnection();
    const channel = await getRabbitMQChannel(connection);
    try {
        
        const q = await channel.assertQueue('',{exclusive: true});
        const correlationId = generateUuid();
        const num = parseInt(args[0]);
        console.log(' [x] Requesting fib(%d)', num);
    
        channel.consume(q.queue, function(msg) {
        
            if (msg && msg.properties.correlationId == correlationId) {
              console.log(' [.] Got %s', msg.content.toString());
              setTimeout(function() {
                connection.close();
                process.exit(0)
              }, 500);
            }
          }, {
            noAck: true
          });
          channel.sendToQueue('rpc_queue',
            Buffer.from(num.toString()),{
              correlationId: correlationId,
              replyTo: q.queue });
    } catch (error) {
        console.log(error)
    }finally{
        // await channel.close();
        // await connection.close();
    }


    
}
function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

await sendToRPCQueue();       
    