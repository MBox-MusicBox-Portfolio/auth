import User from '../../models/user.js';
import { SendQuery } from '../../modules/amqp.js';
import { v4 } from 'uuid';
import {getValidationForgottenPassword} from '../../modules/validator.js';
import * as redis from '../../modules/redis.js';
const forgottenPassKey="ForgottenPass" + v4();
const forgottenKey={
     success: false,
     value:{
        msg:""
     }
}
/**
 * Ищет пользователя в базе данных по Email
 * Find user  with Email in database
 * @param {*} req 
 * @param {*} context 
 * @returns 
 */
export async function getUser(req,context)
{
    let {Email} = req;
    let user = await User.findOne({where: {Email: Email}, attributes:["Id","Name","Email","Password"]});
    if(user){
            context.status = 200;
          redis.RedisSetValue(forgottenPassKey, JSON.stringify({Id:user.dataValues.Id}));
        return user;
    }else{
          context.status=404;
        return false;
    }
}

/**
 * Send message to email
 * Отправляет подтверждение на восстановление пароля 
 * @param {*} req 
 * @param {*} context 
 */
export async function SendMessage(req,context)
{
    let {Email} = req;
    let user = await getUser(req,context);
    if(user === false)
    {
        console.log("User not found");
    }else{
        let link = "http://localhost:4000/api/auth/restore/?ForgottenKey="+forgottenPassKey;
          await SendQuery(forgottenPassKey,user.dataValues.Name,'restore_password',user.dataValues.Email,link);
        forgottenKey.value.msg="You have been sent a link to confirm password reset";
        context.body=forgottenKey;
        }
}
/**
 * Check redis key and changing user password
 * Проверяет ключ и меняет пароль пользователя
 * @param {*} req 
 * @param {*} context 
 */
export async function newPass(req,context)
{
   // const getForgottenPassValidationForm = await getValidationForgottenPassword(req); 
 /***
  * Создать отдельную оболочку для обращения к модели юзерам
  */
    if(req)
    {
        context.status=200;
            let keyName = req.ForgottenKey;
            let key = JSON.parse(await redis.RedisGetValue(keyName));
            if(key)
            {
               //let stringDbKey = key.replace(/^"(.*)"$/, '$1');
               let user = await User.findOne({ where: {Id : key.Id}, attributes: ['Id','Password'] });
            }else{
                forgottenKey.success=false;
                   forgottenKey.value.msg="The link has expired. Send request again";
                context.body = forgottenKey;
            }
        context.body = forgottenKey;
    }else{
           forgottenKey.success=false;
        forgottenKey.value.msg="Empty context from GET HTTP method!";
    }
}