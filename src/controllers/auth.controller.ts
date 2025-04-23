'use strict'
import {validateAuth} from './validations/controller.validations';
import { checkUserData } from '../services/auth.services';
import { UserRepository } from '../repository/user.repository';
import * as AuthUtil from '../utils/AuthUtil.utils';
import { AuthMessages } from '../utils/AuthMessage.util';

const user : UserRepository = new UserRepository();

/**
 * Main Auth function
 * @param object
 * @param ctx
 */
export async function authUser(currentUser: any, ctx: any): Promise<any> {
    try {
        const authFormValidation = await validateAuth(currentUser);
        if (authFormValidation === true){
              const findUser = await user.findUser(currentUser.email);
              const userDataChecked = await checkUserData(findUser, ctx.request.body.password);
            return userDataChecked === true 
                   ? await AuthUtil.handleSuccessfulAuth(findUser,ctx) 
                   : AuthUtil.handleNotFound(userDataChecked,ctx); 
        } else {
            return AuthUtil.handleFailedValidation(authFormValidation,ctx);
        }
    } catch (error:any) {
        console.debug(error);
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    }
}

