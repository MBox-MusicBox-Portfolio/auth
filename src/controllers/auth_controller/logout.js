'use strict'
import {RedisDelKey, RedisGetValue} from  '../../modules/redis.js';

/**
 * Logout current user
 */
export async function logout(key, context)
{
   if(await RedisGetValue("authUser_"+key))
   {
      await RedisDelKey("authUser_"+key);
      console.log("User is logout. Auth Key is dropped ");
   }
}