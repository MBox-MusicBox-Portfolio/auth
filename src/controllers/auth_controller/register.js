import dotenv from 'dotenv';
import User from '../../models/user.js';
import Roles from '../../models/roles.js';
import { v4 } from 'uuid';
import * as redis from '../../modules/redis.js';
import *as rabbit from '../../modules/amqp.js';
import {getValidationRegistration, parserErrorString} from '../../modules/validator.js';
import crypto from 'bcrypt';
dotenv.config();

const response = {
  success: false,
  value: {}
};
/**
 * Form validation function 
 * Валидация формы
 * @param {*} object 
 * @param {*} context 
 */
export async function validationRegisterForm(object, context) {
   try {
     const validation = await getValidationRegistration(object);
     if (validation !== null && validation.error)
     {
        context.status=400;
        console.log(validation.error);
        context.body = await parserErrorString(validation);
     }else{
        const user = await User.findOne({where:{Email: object.Email}, attributes:["Email"]});
     if(!user)
     {
        await createUser(object,context);
          response.success=true;
          response.value={email:"The user created successfully"};
            context.body=response;
      }else{
          context.status=400;
            response.value={email:"The current user exist"}
              context.body=response;
      }
    }
  } catch (error) {
          context.status = 500;
          response.value={
             errors: error};
        context.body=response;
      //onsole.log(error);
  }
}

/**
 * Create new user 
 * Создаёт нового пользователя
 * @param {*} object 
 * @param {*} context 
 * @returns 
 */
export async function createUser(object, context) {
  const salt = process.env.PASS_SALT;
  const role = await Roles.findOne({ where: { Name: 'user' } });
  try {
    const user = await User.create({
        Name: object.Name,
        Email: object.Email,
        RoleId: role.Id,
        Password: crypto.hashSync(object.Password, salt)
    });
    context.status=201;
     let redisKey= "KeyEmail_" +v4();
        await redis.RedisSetValue(redisKey,user.dataValues.Id);
     await rabbit.SendQuery(redisKey,user.dataValues.Name,'register_mail', user.dataValues.Email);

  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
        context.status = 409;
        response.value={errors: error};
      return response;
    }
    throw error;
  }
}
/**
 * Send new letter
 * Отправляет письма с подтверждением почты. 
 * @param {*} redisKey 
 * @param {*} username 
 * @param {*} email 
 */
export async function sendMail(redisKey, username, email) {
  try {
    const confirmationLink = 'http://localhost/api/auth/emailConfirm/?activateKey=KeyEmail_' + redisKey;
        await rabbit.SendQuery(redisKey, username, 'register_mail',email,confirmationLink);
  } catch (ex) {
    console.error(ex);
  }
}
