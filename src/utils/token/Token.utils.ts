import {token} from '../../modules/token.modules';
export namespace TokenUtil{

export async function generateTokenForEmailVerification(user: any): Promise<any> {
    try{  
        return await token("encrypt", {
            email: user.email,
            confirmEmail : true
        });
    }catch(err:any){
        console.debug(err);
    }
}

/**
 * Generated new tokens
 */
export async function generateTokenForAuth(user: any): Promise<any> {
    try{
        return await token("encrypt", {
            id: user.dataValues.Id,
            username: user.dataValues.Username,
            avatar: user.dataValues.Avatar,
            roleId: user.dataValues.RoleId});
     } catch(err:any){
         console.debug(err);
       } 
    }
}