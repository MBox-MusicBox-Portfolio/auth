import Koa from 'koa';
import router from './routes/route';
import { dbConnect } from './modules/db';
import * as redis from './modules/redis';
import dotenv from 'dotenv';
import cors from '@koa/cors';


dotenv.config();

const server = new Koa();
server.use(cors());
server.use(router.routes());
server.use(router.allowedMethods())


try{
    server.listen(process.env.SERVER_PORT,  async() => {
        console.log('Server is running on http://localhost:' + `${process.env.SERVER_PORT}`);
        await dbConnect();
        await redis.RedisConnection();
    });
}catch(error){
    console.error("Server::Exception handler:::" , `${error}`);
}

