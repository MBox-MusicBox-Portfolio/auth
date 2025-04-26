import * as authDTO from '../../controllers/dto/dto.auth.controller';
import { HttpStatusCode } from '../http/HttpStatusCode.enum';
import bcrypt from 'bcrypt';
import {TokenUtil}  from '../token/Token.utils';
import {RedisUtil} from '../../utils/redis/RedisUtils.util';
import dotenv from 'dotenv';
import { Context } from 'koa';

export namespace AuthUtil{
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

export function handleSuccessEmailVerification(message:string,ctx:Context):authDTO.IAuthDTO
{
    ctx.status=HttpStatusCode.OK;
    return authDTO.handleSuccessMessage(message);
}

export function handleErrorEmailVerification(message:string,ctx:Context):authDTO.IAuthDTO
{
    ctx.status=HttpStatusCode.Forbidden;
    return authDTO.handleAppValidationError(message);
}

export function generateLinkForEmailVerification(token:string):string
{
    const link = "http://"+process.env.HTTP_SERVER +"/api/auth/confirmEmail/"+process.env.EMAIL_VERIFICATION_TOKEN + token;
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
       const jwt = await TokenUtil.generateTokenForAuth(user);
                   await RedisUtil.createRedisRecordForAuth(user, jwt);
      return authDTO.handleAuthSuccess(jwt);
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
       const jwtEmailKeyForConfirmation = await TokenUtil.generateTokenForEmailVerification(newUser); 
       const redisEmailVerificationKey:string = process.env.REDIS_EMAIL_VERIFICATION_KEY! + jwtEmailKeyForConfirmation;
    return authDTO.handleSuccessMessage(message);
}

export async function createRedisRecordForConfirmationEmail(user:any,jwt:string):Promise<any>
{
    return await RedisUtil.createRedisRecordForConfirmationEmail(user,jwt);
}

export async function generateTokenForEmailVerification(key:string):Promise<string>
{
    return await TokenUtil.generateTokenForEmailVerification(key);
}

export async function prepareEmailVerification(userData: any): Promise<{ token: string; redisKey: string; link: string }> {
      const token = await TokenUtil.generateTokenForEmailVerification(userData);
      const redisKey = await createRedisRecordForConfirmationEmail(userData, token);
      const link =  generateLinkForEmailVerification(token);
      console.log("Link for email verification: ", link);
    return { token, redisKey, link };
}

export const comparePass = async (currentPassword:string, existUserPassword:string):Promise<boolean>=>{
     return await bcrypt.compare(currentPassword, existUserPassword);
}

export const encryptPassword = async(password:string):Promise<any>=>{
     return await bcrypt.hash(password, process.env.PASS_SALT!);
 }

 export const decryptToken = async (currentJwt: string): Promise<any> => {
    try {
        return await TokenUtil.decryptToken(currentJwt);
    } catch (err: any) {
        console.debug(err);
    }
}
}

