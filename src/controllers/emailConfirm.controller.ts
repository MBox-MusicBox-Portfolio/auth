import dotenv from 'dotenv';
import * as AuthUtil from '../utils/AuthUtil.utils';
import { AuthMessages } from '../utils/AuthMessage.util';
import { UserRepository } from '../repository/user.repository';

dotenv.config();
export async function confirmUserEmail(ctx: any): Promise<any> {
    const token = ctx.params.token;
    try {
        if (typeof(token) === "string") {
            const user = await AuthUtil.RedisExistKey(process.env.EMAIL_VERIFICATION_TOKEN+token);
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