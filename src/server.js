import dotenv from 'dotenv';
import Koa from 'koa';
import {RabbitMQConnection} from './modules/amqp.js';
dotenv.config();
/**
 * Import for routes
 */
import email from './api/auth/email.js';
import login from './api/auth/login.js';
import forgotten from './api/auth/forgotten.js';
import restore from './api/auth/restore.js';
import register from './api/auth/register.js';
import change  from './api/auth/change.js';
import logout from './api/auth/logout.js';

/**
 * Add OAuth modules 
 */
//import facebook from './api/oauth/facebook.js';

/**
 * Create server entity
 */
const server = new Koa();

/**
 * Attach routes to the Koa server 
 */
server.use(register.routes());
server.use(login.routes());
server.use(forgotten.routes());
server.use(change.routes());
server.use(restore.routes());
server.use(email.routes());
server.use(logout.routes());

/**
 * Attach OAuth routes
 */
//server.use(facebook.routes());

/**
 * Allowed methods for HTTP
 */
server.use(register.allowedMethods());
server.use(login.allowedMethods());
server.use(forgotten.allowedMethods());
server.use(change.allowedMethods());
server.use(email.allowedMethods());
server.use(logout.allowedMethods());
server.use(forgotten.allowedMethods());
//server.use(oAuthRouter.allowedMethods());

server.on('error', err => {
    console.error(`[${new Date().toLocaleString()}]: Server module:[Service]: Server down: ${err}`);
});
  
try{
    server.listen(process.env.PORT || 4000, process.env.HTTP_SERVER, async ()=>{
            console.log(`[${new Date().toLocaleString()}]   : Server Auth Module:[Service]: Server running | Port ${process.env.SERVER_PORT}`);
            RabbitMQConnection();
    });

}catch(ex){
    console.log(`[${new Date().toLocaleString()}]  : Server module:[Service]: ${ex} `);
}
