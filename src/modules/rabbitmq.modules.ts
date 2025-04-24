import dotenv from 'dotenv';
import * as rabbit from 'amqplib';

dotenv.config();
let connection: rabbit.ChannelModel | null;
let channel: rabbit.Channel | null;
const connectString : string = process.env.CONNECTION_URI_RABITMQ!;
const queue:string = process.env.RABBITMQ_QUEUE_NAME!;

/**
 * Устанавливает соединение с RabbitMQ
 */
export async function RabbitMQConnection(){
    try {
         connection = await rabbit.connect(connectString);
         channel = await connection.createChannel();
        console.log(`[${new Date().toLocaleString()}] : RabbitMQ Module : Connection successfully established`);
        return true;
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] : RabbitMQ Module : Connection error: ${err}`);
        return false;
    }
}

/**
 * Отправляет сообщение в очередь RabbitMQ
 * @param redisKey Уникальный идентификатор
 * @param email Email получателя
 * @param template Шаблон сообщения
 * @param username Имя пользователя
 */
export async function SendQuery(redisKey: string, email: string, template: string, username: string){
   
    try {
        await channel!.assertQueue(queue, { durable: false });
        const message = {
            To: email,
            Id: redisKey,
            Body: {
                Template: template,
                Name: username,
            },
        };
        channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`[${new Date().toLocaleString()}] : RabbitMQ Module : Message sent to queue "${queue}"`);
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] : RabbitMQ Module : Error sending message: ${err}`);
    }
}

/**
 * Закрывает соединение с RabbitMQ
 */
export async function CloseRabbitMQConnection(){
    try {
        if (channel) {
            await channel.close();
            channel = null;
        }
        console.log(`[${new Date().toLocaleString()}] : RabbitMQ Module : Connection closed`);
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] : RabbitMQ Module : Error closing connection: ${err}`);
    }
}
