import Koa from 'koa';
import cors from '@koa/cors';
import dotenv from 'dotenv';
import router from './routes/route';
import {dbConnect} from './modules/db.modules';
import * as redis from './modules/redis.modules';

dotenv.config({path: '.env'});

const server = new Koa();
server.use(cors());
server.use(router.routes());
server.use(router.allowedMethods());
/*
server.use(
    koaSwagger({
      routePrefix: '/docs', 
      swaggerOptions: { url: 'http://localhost:' + process.env.SERVER_PORT + '/swagger.json' }
    })
)*/

try {
    server.listen(process.env.SERVER_PORT, async () => {
        console.log('Server is running on http://localhost:' + process.env.SERVER_PORT);
        await dbConnect();
        await redis.RedisConnection();
    });
} catch (error) {
    console.error("Server::Exception handler:::", `${error}`);
}
