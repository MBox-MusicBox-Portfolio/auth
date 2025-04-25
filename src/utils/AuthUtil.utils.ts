import { authDTO } from '../controllers/dto/dto.auth.controller';
import { HttpStatusCode } from './HttpStatusCode.util';
import bcrypt from 'bcrypt';
import {token} from '../modules/token.modules';
import * as redis from '../modules/redis.modules';
import dotenv from 'dotenv';

dotenv.config();

export async function generateTokenForEmailVerification(user: any): Promise<any> {
    try{  
        return await token("encrypt", {
            email: user.email,
            confirmEmail : true
        });
    }catch(err:any){
        console.debug(err);
    }
}

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
        return keyRedis !== false ? true : false;
    }catch(err:any){
        console.debug(err);
        return false;
    }
}

export async function RedisDeleteKey(keyName:string):Promise<any>{
    try{
        const redisKeyExist = await RedisExistKey(keyName);
        if(redisKeyExist === true) { await redis.RedisDelKey(keyName);}
        return redisKeyExist;
    }catch(err:any){
        console.debug(err);
        return false;
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
    return authDTO(false,null,null,null,errorContext);
}

export function handleInternalServerError(errorContext:any,ctx:any)
{
    ctx.status = HttpStatusCode.InternalServerError;
    return authDTO(false,null,null,errorContext);
}

export function handleUnauthorized(errorContext:any,ctx:any)
{
    ctx.status = HttpStatusCode.Unauthorized;
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

export function handleSuccessLogout(message:string,ctx:any):any
{
    ctx.status=HttpStatusCode.OK;
    return authDTO(true,null,message,null,null);
}

export async function sendEmailVerificationMessage(newUser:any,message:string,ctx:any):Promise<any>
{
    ctx.status=HttpStatusCode.OK;
       const jwtEmailKeyForConfirmation = await generateTokenForEmailVerification(newUser); 
       const redisEmailVerificationKey:string = process.env.REDIS_EMAIL_VERIFICATION_KEY + jwtEmailKeyForConfirmation;

    return authDTO(true,null,message,null,null);
}

export function generateLinkForEmailVerification(token:string):string
{
    const link = "http://"+process.env.HTTP_SERVER +"/api/auth/confirmEmail/"+token;
    return link;
}

export const comparePass = async (currentPassword:string, existUserPassword:string):Promise<boolean>=>{
     return await bcrypt.compare(currentPassword, existUserPassword);
}

export const encryptPassword = async(password:string):Promise<any>=>{
     return await bcrypt.hash(password, process.env.PASS_SALT!);
}