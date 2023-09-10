import {RedisGetValue} from '../modules/redis.js'

/**
 * Мидлвари для защищенных роутов
 */

const isAuth = async (ctx, next)=>{
    let keyExists = await RedisGetValue("authUser_" + ctx.request.body.Token);
    if (keyExists === true) {
          ctx.status = 200;  
          ctx.body = "Authorized";
        return true;
    } else {
          ctx.status=403;
          ctx.body="Access Denied! You're must to re-authorized. Abort!";
        return false;
    }
   await next();
}
export default isAuth;

