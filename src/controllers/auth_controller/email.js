import dotenv from 'dotenv';
import {RedisDelKey, RedisGetKey, RedisGetValue} from '../../modules/redis.js';
import User from '../../models/user.js';
dotenv.config();
const response={
    success:false,
    value:{}
}

const activateKey={
    redis: ""
}

export async function confirmEmail(object, ctx) {
    /***
     * TODO Сделать проверку на null 
*/
    try{
        let key = await RedisGetValue(object.activateKey);
        //let stringDbKey = key.replace(/^"(.*)"$/, '$1');
        const user = await User.findOne({where:{Id:key}, attributes:['Id', 'isEmailVerify']});
              user.IsEmailVerify = true;
              await user.save();
              await delKey(key);
        ctx.status = 200;
              response.success=true;
              response.value={email:"Email is confirmed"}
        ctx.body=response;
    }catch(ex){
        ctx.status = 500;
             response.success=false;
             response.value={error: `${ex}`}      
        ctx.body=response;  
    }
    
}

/**
 * Check email confirmation
 * Подтвержден пользователь или нет 
 * @param {*} object 
 */
export async function isConfirmEmail(object)
{
    if(object)
    {

    }
}

export async function checkKeyExpiration(key)
{
  if(key){ return (RedisGetKey ? true : false);}
}

export async function delKey(key)
{
    await RedisDelKey(key);
}