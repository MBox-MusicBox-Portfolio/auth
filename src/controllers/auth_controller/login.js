import dotenv from 'dotenv';
import { createJWT, decodeJWT } from '../../modules/token.js';
import * as validator from '../../modules/validator.js';
import * as redis from '../../modules/redis.js';
import User from '../../models/user.js';
dotenv.config();

/**
 * Валидирование формы и данных в базе данных 
 * Form and Db data validation 
 * @param {*} object 
 * @param {*} context 
 */
export async function validationLoginForm(object, context) {
    try {
        const validation = await validator.getValidationAuthorization(object);
        if(validation.error)
        {
            context.status=400;
            context.body= await validator.parserErrorString(validation);
        }else{
            const {Email,Password} = context.request.body;
                const user = await User.findOne({ where: {Email : object.Email}, attributes: ['Id','Name', 'Avatar','Email', 'RoleId', 'IsBlocked', 'IsEmailVerify', 'Birthday','Password']});
                const dbValidate = await validator.databaseValidator(context.request.body,user,context);
                context.body=dbValidate;
        if(dbValidate === true)
        {
            let jwtToken  = await createJWT(await dropObjectProperty(user.dataValues,await user.getRole()));
            let decrypt   = await decodeJWT(jwtToken);
            let redisDb   = await AddJWTToRedis(jwtToken,user.dataValues.Id);
                context.body = {
                    success:true,
                    token:jwtToken,
                    decode: decrypt
                };   
       }
    }      
    }catch(ex){
        context.status=500;
        context.body={
            success:false,
            value:{
                error: `[${Date.now().toLocaleString() } Login Modules::validationLoginForm ] : Exception handler: ${ex}`
            }
        }
    }
}

export async function dropObjectProperty(user, rolename) {
  return user
    ? (
        delete user.Password,
        delete user.RoleId,
        rolename?.dataValues?.Name ? (user.Role = rolename.dataValues.Name) : null,
        user
      )
    : null;
}

export async function getRedisValue(authKey)
{
    if(authKey.token)
    {
       let compareToken = await redis.RedisGetValue(authKey.token);
        return compareToken === 1;
    }
}   

/**
 * Добавление JWT токена в Redis 
 * Set up JWT token to the redis 
 * @param {*} user 
 * @param {*} token 
 */
export async function AddJWTToRedis(jwt,user) {
    try {
        if (user || token) {
            redis.RedisSetValue("authUser_"+jwt, user,7892928);
        }
    } catch (ex) {
       console.error(ex);
    }
}
