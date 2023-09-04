import dotenv from 'dotenv';
import { decodeJWT } from '../../modules/token.js';
import User from '../../models/user.js';
import crypto from 'bcrypt';
dotenv.config();

let requestData = {
    token: "", 
    newPassword: ""
}
/**
 * Получаем юзера
 * @param {*} token 
 * @returns 
 */
export async function getUser(token)
{ 
    try{
        let jwtDecode = await decodeJWT(token);
        let user = await User.findOne({ where: {Email : jwtDecode.Email}, attributes: ['Id','Password']});
        if(user)
        {
            return user; 
        }else{
            return false;
        }
    }catch(ex){
         console.error(ex);
    } 
}
/**
 * Function for changing user password
 * Функция для изменения пользовательского пароля 
 * @param {*} token, oldPassword , newPassword, rePassword
 * @returns 
 */
export async function changePassword(token, oldPassword , newPassword)
{
    let salt = process.env.PASS_SALT;
    let user = await getUser(token);
    let oldPass =  crypto.hashSync(oldPassword, salt);
    if(user.dataValues.Password === oldPass)
    {
        user.Password = await crypto.hashSync(newPassword, salt);
        await user.save();
    }else{
        console.log("Password not much");
    }
}