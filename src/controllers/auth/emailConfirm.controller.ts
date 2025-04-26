import dotenv from 'dotenv';
import { AuthUtil} from '../../utils/auth/AuthUtil.utils';
import { RedisUtil } from '../../utils/redis/RedisUtils.util';
import { TokenUtil } from '../../utils/token/Token.utils';
import { AuthMessages } from '../../utils/messages/AuthMessage.enum';
import { UserRepository } from '../../repository/implementations/user.implementation';

const currentUser:UserRepository = new UserRepository();
dotenv.config();

export async function confirmUserEmail(ctx: any): Promise<any> {
    const token:string = ctx.params.token;
    const cutToken = token.split('_')[1];   
    try {
        if (typeof(token) === "string") {
            const user = await RedisUtil.RedisExistKey(token);
            if (user) {
               const decryptedUserData = await TokenUtil.decryptToken(cutToken);
                  if(decryptedUserData){
                     const userEmailUpdate = await currentUser.updateUser(decryptedUserData);
                     await RedisUtil.RedisDeleteKey(token);
                  }else{
                    return AuthUtil.handleErrorEmailVerification(AuthMessages.NotValidTokenSignature, ctx);
                  }
                  return AuthUtil.handleSuccessEmailVerification(AuthMessages.EmailIsConfirmed, ctx);
            } else {
                return AuthUtil.handleErrorEmailVerification(AuthMessages.TokenExpired, ctx);
            }
        }
    } catch (error: any) {
           console.debug(error);
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError, ctx);
    }
}