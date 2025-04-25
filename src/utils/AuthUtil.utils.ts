import * as authDTO from '../controllers/dto/dto.auth.controller';
import { HttpStatusCode } from './HttpStatusCode.util';
import bcrypt from 'bcrypt';
import {token} from '../modules/token.modules';
import * as redis from '../modules/redis.modules';
import dotenv from 'dotenv';
import { Context } from 'koa';


dotenv.config();

export function handleFailedValidation(errorContext:any,ctx:Context) : authDTO.IAuthDTO
{
    ctx.status = HttpStatusCode.BadRequest;
    return authDTO.handleValidationError(errorContext);
}
    
export function handleAppValidation(errorContext:any,ctx:Context) : authDTO.IAuthDTO
{
    ctx.status = HttpStatusCode.BadRequest;
    return authDTO.handleAppValidationError(errorContext);
}

export function handleInternalServerError(errorContext:any,ctx:Context) : authDTO.IAuthDTO
{
    ctx.status = HttpStatusCode.InternalServerError;
    return authDTO.handleAppValidationError(errorContext);
}

export function handleUnauthorized(errorContext:any,ctx:Context) : authDTO.IAuthDTO
{
    ctx.status = HttpStatusCode.Unauthorized;
    return authDTO.handleAppValidationError(errorContext);
}

export function handleNotFound(errorContext:any,ctx:Context): authDTO.IAuthDTO{
    ctx.status=HttpStatusCode.NotFound
    return authDTO.handleAppValidationError(errorContext);
}

export function handleSuccessfulRegister(message:string,ctx:Context):authDTO.IAuthDTO
{
    ctx.status=HttpStatusCode.Created;
    return authDTO.handleSuccessMessage(message);
}

export function handleSuccessLogout(message:string,ctx:Context):authDTO.IAuthDTO
{
    ctx.status=HttpStatusCode.OK;
    return authDTO.handleSuccessMessage(message);
}

export function generateLinkForEmailVerification(token:string):string
{
    const link = "http://"+process.env.HTTP_SERVER +"/api/auth/confirmEmail/"+token;
    return link;
}


/**
 * For successfull authorization
 * @param user 
 * @param ctx 
 * @returns 
 */
export async function handleSuccessfulAuth(user:any, ctx:Context):Promise<authDTO.IAuthDTO>
{
    ctx.status=HttpStatusCode.OK;
       const jwt = await generateTokenForAuth(user);
                   await createRedisRecordForAuth(user, jwt);
      return authDTO.handleAuthSuccess(jwt);
}


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

/**
 * Sending email verification message
 * @param newUser 
 * @param message 
 * @param ctx 
 * @returns 
 */
export async function sendEmailVerificationMessage(newUser:any,message:string,ctx:any):Promise<authDTO.IAuthDTO>
{
    ctx.status=HttpStatusCode.OK;
       const jwtEmailKeyForConfirmation = await generateTokenForEmailVerification(newUser); 
       const redisEmailVerificationKey:string = process.env.REDIS_EMAIL_VERIFICATION_KEY + jwtEmailKeyForConfirmation;
    return authDTO.handleSuccessMessage(message);
}

export const comparePass = async (currentPassword:string, existUserPassword:string):Promise<boolean>=>{
     return await bcrypt.compare(currentPassword, existUserPassword);
}

export const encryptPassword = async(password:string):Promise<any>=>{
     return await bcrypt.hash(password, process.env.PASS_SALT!);
}