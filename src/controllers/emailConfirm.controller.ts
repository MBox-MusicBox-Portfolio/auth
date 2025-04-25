import * as AuthUtil from '../utils/AuthUtil.utils';
export async function confirmUserEmail(ctx: any): Promise<any> {
    return await AuthUtil.generateLinkForEmailVerification(ctx.params.token);
}