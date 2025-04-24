'use strict';

import dotenv from 'dotenv';
import {validateNewUser} from './validations/controller.validations';
import { UserRepository } from '../repository/user.repository';
import * as AuthUtil from '../utils/AuthUtil.utils';
import { AuthMessages } from '../utils/AuthMessage.util';

dotenv.config();

const user:UserRepository = new UserRepository();

export async function createNewUser(newUser: any, ctx: any): Promise<any> {
    try{
        const registrationFormValidation = await validateNewUser(ctx.request.body);
        if (registrationFormValidation === true){
           const encryptPassword = await AuthUtil.encryptPassword(newUser.password);
           const result = await user.createUser(newUser,encryptPassword,"user");
           return result === true ? AuthUtil.handleSuccessfulRegister(AuthMessages.UserCreatedSuccessfully,ctx)
                                  : AuthUtil.handleAppValidation(AuthMessages.UserAlreadyExists,ctx);    
        } else {
            return AuthUtil.handleFailedValidation(registrationFormValidation,ctx);
        }
    }catch(error:any){
        console.log(error); 
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    }    
}
