import dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import {RabbitMQConnection} from './modules/amqp.js';

import email from './api/auth/email.js';
import login from './api/auth/login.js';
import forgotten from './api/auth/forgotten.js';
import restore from './api/auth/restore.js';
import register from './api/auth/register.js';
import change  from './api/auth/change.js';
const server = new Koa();


server.use(register.routes());
server.use(login.routes());
server.use(forgotten.routes());
server.use(change.routes());
server.use(restore.routes());
server.use(email.routes());

server.use(register.allowedMethods());
server.use(login.allowedMethods());
server.use(forgotten.allowedMethods());
server.use(change.allowedMethods());
server.use(email.allowedMethods());

server.use(forgotten.allowedMethods());
server.on('error', err => {
    console.error(`[${new Date().toLocaleString()}]: Server module:[Service]: Server down: ${err}`);
});
  
try{
    server.listen(process.env.PORT || 4000, process.env.HTTP_SERVER, async ()=>{
            console.log(`[${new Date().toLocaleString()}]   : Server module:[Service]: Server running | Port ${process.env.SERVER_PORT}`);
            RabbitMQConnection();
    });

}catch(ex){
    console.log(`[${new Date().toLocaleString()}]  : Server module:[Service]: ${ex} `);
}
