//import bcrypt from 'bcrypt';
import { AuthMessages } from '../utils/AuthMessage.util';
import * as AuthUtil from '../utils/AuthUtil.utils';
const checkPass = async (currentPassword:string , existUserPassword:string) : Promise<boolean> =>{
    return await AuthUtil.comparePass(currentPassword,existUserPassword);
}

const isBlockedUser = (currentUser:any):boolean => {
    return currentUser?.dataValues.IsBlocked;
}

const userIsExist = (currentUser: any): boolean => {
    return currentUser !== null && currentUser !== undefined;
}


export const checkUserData = async (currentUser: any, entriedPassword: string):Promise<string | boolean> => {
    if (!userIsExist(currentUser)) {
        return AuthMessages.UserNotFound;
    }

    if (isBlockedUser(currentUser)) {
         return AuthMessages.UserIsBanned;
    }
    const passwordIsCorrect = await checkPass(entriedPassword,currentUser.dataValues.Password);
    if (!passwordIsCorrect) {
        return AuthMessages.IncorrectPassword;
    }
    return true; 
}
