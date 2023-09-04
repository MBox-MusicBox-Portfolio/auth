import dotenv from 'dotenv';
import {RedisDelKey, RedisGetKey} from '../../modules/redis.js';
import User from '../../models/user.js';
dotenv.config();
const response={
    success:false,
    value:{}
}

const activateKey={
    redis: ""
}

/**
 * Function for email confirmation
 * Функция подтверждения почты
 * @param {*} object 
 * @param {*} ctx 
 */

export async function confirmEmail(object, ctx) {
    try{
    if(object && ctx)
    {
        let key = await RedisGetValue(object.activateKey);
        //let stringDbKey = key.replace(/^"(.*)"$/, '$1');
        const user = await User.findOne({where:{Id:key}, attributes:['Id', 'isEmailVerify']});
              user.IsEmailVerify = true;
              await user.save();
              await RedisDelKey(key);
        ctx.status = 200;
              response.success=true;
              response.value={email:"Email is confirmed"}
        ctx.body=response;
    }else{
        console.error("The Email controller is down because you sent empty arguments! Abort")
     }
    }catch(ex){
        ctx.status = 500;
             response.success=false;
             response.value={error: `${ex}`}      
        ctx.body=response;  
    }
}

/**
 * 
 * @param {*} key 
 * @returns 
 */
export async function checkKeyExpiration(key)
{
  if(key){ return (await RedisGetKey ? true : false);}
}
