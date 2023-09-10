import dotenv from 'dotenv';
import {RedisDelKey, RedisExistKey, RedisGetValue} from '../../modules/redis.js';
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
    if(await RedisExistKey(object.activateKey) == true)
    {
        let key = await RedisGetValue(object.activateKey);
        const user = await User.findOne({where:{Id:key}, attributes:['Id', 'IsEmailVerify']});
              user.IsEmailVerify = true;
              await user.save();
              await RedisDelKey(ctx.query.activateKey);
        ctx.status = 200;
              response.success=true;
              response.value={error:"Email is confirmed"}
        ctx.body=response;
    }else{
        ctx.status = 400;
              response.success=false;
              response.value={error:"Email confirmation failed because activation key has expired. Please log in again and receive an new activation key. Abort!"}
        ctx.body=response;
     }
    }catch(ex){
        ctx.status = 500;
             response.success=false;
             response.value={error: `${ex}`}      
        ctx.body=response;  
    }
}
