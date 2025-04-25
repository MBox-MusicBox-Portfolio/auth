
import { AuthUtil } from '../../utils/auth/AuthUtil.utils';
import { RedisUtil } from '../../utils/redis/RedisUtils.util';
import { AuthMessages } from '../../utils/messages/AuthMessage.enum';

export async function logoutUser(ctx: any): Promise<any> 
{
    const token = ctx.request.header["authorization"].split(' ')[1];
    try {
       if(typeof(token) === "string")
       {
         const deleteAuth = await RedisUtil.RedisDeleteKey(`${process.env.AUTH_REDIS_REC}`+token); 
        return deleteAuth === true 
               ? AuthUtil.handleSuccessLogout(AuthMessages.LogoutSuccess,ctx)
               : AuthUtil.handleAppValidation(AuthMessages.LogoutFailed,ctx);
       } 
    } catch (error:any) {
         console.debug(error);
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    } 
}