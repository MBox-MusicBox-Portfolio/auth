'use strict'
import {RedisDelKey, RedisGetKey} from  '../../modules/redis.js';

/**
 * Logout current user
 */
export async function logout(key)
{
   if(await RedisGetKey("authUser_"+key))
   {
      await RedisDelKey("authUser_"+key);
      console.log("User is logout. Auth Key is dropped ");
   }
}