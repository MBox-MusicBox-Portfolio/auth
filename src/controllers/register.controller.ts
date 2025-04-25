'use strict';

import dotenv from 'dotenv';
import {validateNewUser} from './validations/controller.validations';
import { UserRepository } from '../repository/user.repository';
import * as AuthUtil from '../utils/AuthUtil.utils';
import { AuthMessages } from '../utils/AuthMessage.util';

dotenv.config();

const user:UserRepository = new UserRepository();

export async function createNewUser(ctx: any): Promise<any> {
    try{
        const registrationFormValidation = await validateNewUser(ctx.request.body);
        if (registrationFormValidation){
           const encryptPassword = await AuthUtil.encryptPassword(ctx.request.body.password);
           const result = await user.createUser(ctx.request.body,encryptPassword,"user");
            if(result === true){
                  const { token, redisKey, link } = await prepareEmailVerification(ctx.request.body);
                return AuthUtil.handleSuccessfulRegister(AuthMessages.UserCreatedSuccessfully,ctx)
            }else{
               return  AuthUtil.handleAppValidation(AuthMessages.UserAlreadyExists,ctx);
            }    
        } else {
            return AuthUtil.handleFailedValidation(registrationFormValidation,ctx);
        }
    }catch(error:any){
          console.log(error); 
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    }    
}

async function prepareEmailVerification(userData: any): Promise<{ token: string; redisKey: string; link: string }> {
    const token = await AuthUtil.generateTokenForEmailVerification(userData);
        const redisKey = await AuthUtil.createRedisRecordForConfirmationEmail(userData, token);
        const link = AuthUtil.generateLinkForEmailVerification(token);
    return { token, redisKey, link };
}