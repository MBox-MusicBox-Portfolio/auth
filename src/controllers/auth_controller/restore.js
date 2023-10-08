import * as redis from '../../modules/redis.js';
import User from '../../models/user.js'
import dotenv from 'dotenv';
import crypto from 'bcrypt';
dotenv.config();

export async function getUser(request,ctx)
{
    if(await redis.RedisExistKey(request.rKey))
    {
         let keyRedis = JSON.parse(await redis.RedisGetValue(request.rKey));
         let user = await User.findOne({ where: {Id : keyRedis.Id}, attributes: ['Id','Password']});
         return user;
    }else{
        ctx.status=400;
        ctx.body={
            success:true,
            value:{
              message:"Your current key has expired. Please initiate the password reset again"
            }
        }
    }
}

/**
 *  ctx.status=200;
         ctx.body={
                success:true,
                value:{message:"Password is restored"}
         }
         
 */
export default function changePass(ctx,user)
{
    try{
        let salt = process.env.PASS_SALT;
    }catch(err){
       ctx.status=500;
       ctx.body={
           success:false,
           value:{
                message:"An error occurred during password reset. Because:" +`${err}`
           }
       }
    }
}