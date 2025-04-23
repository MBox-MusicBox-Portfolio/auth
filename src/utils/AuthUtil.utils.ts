import { authDTO } from '../controllers/dto/dto.auth.controller';
import { HttpStatusCode } from './HttpStatusCode.util';
import bcrypt from 'bcrypt';
import {token} from '../modules/token.modules';
import * as redis from '../modules/redis.modules';
import dotenv from 'dotenv';

dotenv.config();
    
/**
 * Generated new tokens
 */
export async function generateTokenForAuth(user: any): Promise<any> {
    try{
        return await token("encrypt", {
            id: user.dataValues.Id,
            username: user.dataValues.Username,
            avatar: user.dataValues.Avatar,
            roleId: user.dataValues.RoleId});
     } catch(err:any){
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
        await redis.RedisSetValue("AuthKey" + jwt, {
              id: user.dataValues.Id,
              username: user.dataValues.Username,
              avatar: user.dataValues.Avatar,
              roleId: user.dataValues.RoleId
        })
    } catch (error) {
        console.debug(error);
    }
}

export function handleFailedValidation(errorContext:any,ctx:any) : any
{
    ctx.status = HttpStatusCode.BadRequest;
    return authDTO(false,null,errorContext);
}
    
export function handleAppValidation(errorContext:any,ctx:any)
{
    ctx.status = HttpStatusCode.BadRequest;
    return authDTO(false,null,null,errorContext);
}

export function handleInternalServerError(errorContext:any,ctx:any)
{
    ctx.status = HttpStatusCode.InternalServerError;
    return authDTO(false,null,null,errorContext);
}

export function handleNotFound(errorContext:any,ctx:any){
    ctx.status=HttpStatusCode.NotFound
    return authDTO(false,null,null,errorContext);
}

/**
 * For successfull authorization
 * @param user 
 * @param ctx 
 * @returns 
 */
export async function handleSuccessfulAuth(user:any, ctx:any):Promise<any>
{
    ctx.status=HttpStatusCode.OK;
       const jwt = await generateTokenForAuth(user);
                   await createRedisRecordForAuth(user, jwt);
      return authDTO(true,jwt,null);
}

export function handleSuccessfulRegister(message:string,ctx:any):any
{
    ctx.status=HttpStatusCode.Created;
    return authDTO(true,null,message,null,null);
}

export const comparePass = async (currentPassword:string, existUserPassword:string):Promise<boolean>=>{
     return await bcrypt.compare(currentPassword, existUserPassword);
}

export const encryptPassword = async(password:string):Promise<any>=>{
     return await bcrypt.hash(password, process.env.PASS_SALT!);
}