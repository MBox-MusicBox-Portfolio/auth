'use strict';

import dotenv from 'dotenv';
import { AuthValidator} from '../validations/auth/auth.validations';
import { UserRepository } from '../../repository/implementations/user.implementation';
import { AuthUtil } from '../../utils/auth/AuthUtil.utils';
import { AuthMessages } from '../../utils/messages/AuthMessage.enum';
import { SendQuery } from '../../modules/rabbitmq.modules';

dotenv.config();
const user:UserRepository = new UserRepository();

export async function createNewUser(ctx: any): Promise<any> {
    try{
        const registrationFormValidation = await AuthValidator.validateNewUser(ctx.request.body);
        if (registrationFormValidation){
           const encryptPassword = await AuthUtil.encryptPassword(ctx.request.body.password);
           const result = await user.createUser(ctx.request.body,encryptPassword,"user");
            if(result === true){
                  const { token, redisKey, link } = await AuthUtil.prepareEmailVerification(ctx.request.body);
                  await SendQuery(ctx.request.body.email, "register_mail", ctx.request.body.username);
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