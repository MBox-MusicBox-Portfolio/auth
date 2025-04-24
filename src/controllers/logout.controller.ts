
import * as AuthUtil from '../utils/AuthUtil.utils';
import { AuthMessages } from '../utils/AuthMessage.util';

export async function logoutUser(ctx: any): Promise<any> 
{
    const token = ctx.request.header["authorization"].split(' ')[1];
    try {
       if(typeof(token) === "string")
       {
         const deleteAuth = await AuthUtil.RedisDeleteKey(token); 
        return deleteAuth === true 
               ? AuthUtil.handleSuccessLogout(AuthMessages.LogoutSuccess,ctx)
               : AuthUtil.handleAppValidation(AuthMessages.LogoutFailed,ctx);
       } 
    } catch (error:any) {
        console.debug(error);
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    } 
}