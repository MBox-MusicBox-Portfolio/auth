import * as redis from '../../modules/redis.modules';

export namespace RedisUtil {

export async function RedisConnection(): Promise<void> {
    try {
        await redis.RedisConnection();
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}]   : Redis module:[ As Service] Exceptions happens, because:` + error)
    }
}

export async function createRedisRecordForConfirmationEmail(user:any,jwt:string): Promise<any> {
    try{
        await redis.RedisSetValue(process.env.EMAIL_VERIFICATION_TOKEN + jwt,5000, {
                email: user.email,
                confirmEmail : true
            });
        }catch(err:any){
            console.debug(err);
    }
}    
/**
 * Created new records in the redis
 * @param user object
 * @param jwt
 */
export async function createRedisRecordForAuth(user: any, jwt: string): Promise<any> {
    try {
    
        await redis.RedisSetValue(process.env.AUTH_REDIS_REC + jwt,36000,{
              id: user.dataValues.Id,
              username: user.dataValues.Username,
              avatar: user.dataValues.Avatar,
              roleId: user.dataValues.RoleId
        })
    } catch (error) {
        console.debug(error);
    }
}

export async function RedisExistKey(key:string):Promise<boolean>{
    try{
        const keyRedis = await redis.RedisExistKey(key);
        return keyRedis !== false;
    }catch(err:any){
        console.debug(err);
        return false;
    }
}

export async function RedisDeleteKey(keyName:string):Promise<any>{
    try{
        const redisKeyExist = await RedisExistKey(keyName);
        if(redisKeyExist) { await redis.RedisDelKey(keyName);}
        return redisKeyExist;
    }catch(err:any){
        console.debug(err);
        return false;
    }
  }
}