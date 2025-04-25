import dotenv from 'dotenv';
import { AuthUtil} from '../../utils/auth/AuthUtil.utils';
import { RedisUtil } from '../../utils/redis/RedisUtils.util';
import { AuthMessages } from '../../utils/messages/AuthMessage.enum';

dotenv.config();
export async function confirmUserEmail(ctx: any): Promise<any> {
    const token = ctx.params.token;
    try {
        if (typeof(token) === "string") {
            const user = await RedisUtil.RedisExistKey(process.env.EMAIL_VERIFICATION_TOKEN+token);
            if (user) {
                return AuthUtil.handleSuccessLogout(AuthMessages.EmailIsConfirmed, ctx);
            } else {
                return AuthUtil.handleAppValidation(AuthMessages.TokenExpired, ctx);
            }
        }
    } catch (error: any) {
        console.debug(error);
        return AuthUtil.handleInternalServerError(AuthMessages.InternalServerError, ctx);
    }
}