import User from '../../models/user.js';
import { SendQuery } from '../../modules/amqp.js';
import { v4 } from 'uuid';
import {getValidationForgottenPassword} from '../../modules/validator.js';
import * as redis from '../../modules/redis.js';
const forgottenPassKey="ForgottenPass_" + v4();
let response={
    success:true,
    value:{}
}

/**
 * Ищет пользователя в базе данных по Email
 * Find user  with Email in database
 * @param {*} req 
 * @returns  response 
 */
export async function getUser(req)
{
    let {Email} = req;
    let user =await User.findOne({where: {Email: Email}, attributes:["Id","Email"]});
    if(user){
        await redis.RedisSetValue(forgottenPassKey, JSON.stringify({Id:user.dataValues.Id}),3000);
        response.value={
            msg: "User found",
            redisKey: forgottenPassKey
        }
        return response;
    }else{
        response.success=false;
        response.value={
            msg: "The user does not exist yet"
        }
        return response;
    }
}
