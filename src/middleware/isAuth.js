import {RedisGetKey} from '../modules/redis.js'

/**
 * Мидлвари для защищенных роутов
 */
export async function isAuth(ctx)
{
    ctx.set('Authorization', `Bearer ${ctx.token}`);
    ctx.status=202;
}