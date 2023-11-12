import {RedisExistKey, RedisGetValue} from '../modules/redis.js'

/**
 * Мидлвари для защищенных роутов
 */
const isAuth = async (ctx, next)=>{
    let keyExists = await RedisExistKey("authUser_" + ctx.request.body.Token);
    console.log(ctx.request.body.Token)
    if (keyExists === true) {
          ctx.status = 200;  
          ctx.body = {
            success:true,
            value:{
              message: `[${ new Date().toLocaleString()} MiddleWare module::IsAuthMiddleware function] : User authorized`  
            }
          };
        return true;
    } else {
          ctx.status=403;
          ctx.body={
            success:false,
            value:{
               error: `[${new Date().toLocaleString()}  Middleware module::IsAuthMiddleware function]  : Access Denied! You're must to re-authorized. Abort! `
            }
          }

        return false;
    }
   await next();
}
export default isAuth;

