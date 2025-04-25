'use strict'
import { AuthValidator } from '../validations/auth/auth.validations';
import { AuthService } from '../../services/auth/auth.services';
import { UserRepository } from '../../repository/implementations/user.implementation';
import { AuthUtil } from '../../utils/auth/AuthUtil.utils';
import { AuthMessages } from '../../utils/messages/AuthMessage.enum';
 
const user : UserRepository = new UserRepository();

/**
 * Main Auth function
 * @param object
 * @param ctx
 */
export async function authUser(ctx: any): Promise<any> {
    try {
        const currentUser= ctx.request.body;
        const authFormValidation = await AuthValidator.validateAuth(currentUser);
        if (authFormValidation === true){
              const findUser = await user.findUser(currentUser.email);
              const userDataChecked = await AuthService.checkUserData(findUser, ctx.request.body.password);
            return userDataChecked === true 
                   ? await AuthUtil.handleSuccessfulAuth(findUser,ctx) 
                   : AuthUtil.handleAppValidation(userDataChecked,ctx); 
        } else {
            return AuthUtil.handleFailedValidation(authFormValidation,ctx);
        }
    } catch (error:any) {
        console.debug(error);
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    }
}

