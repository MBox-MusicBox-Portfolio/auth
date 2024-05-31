'use strict'
import { User } from '../models/User';
import bcrypt, { compare } from 'bcrypt';
import * as redis from '../modules/redis';
import {token} from '../modules/token';
import { validateAuth } from '../routes/dtos/dto';


/**
 * Auth function
 * @param object 
 * @param ctx 
 */
export async function authUser(object:any, ctx:any) : Promise<any> 
{
    try {
        const authFormValidation = await validateAuth(object);
        if (authFormValidation == true) {
            if (await existUserIntoDb(object) == true) {
                if(await comparePass(object) == false){
                    ctx.status=400;
                    return({success:false, value:"Incorrect password"});       
            }else if(await checkingBlockedUserOrNo(object) == false){
                    ctx.status=200;
                      const user = await getUserInstance(object); 
                      const jwt = await generateToken(user);
                    await createRedisRecord(user,jwt);
                 return  {success:true,value:{access_token:jwt}} 
            }else{
             ctx.status=403;   
             return {success:false,value:"Sorry your login was banned by admin"}
            }
        }else{
            ctx.status=400;
            return {success:false,value:"User isn't exist"};
        }
    }else{
            ctx.status=400;
            return {success:false,value:authFormValidation}   
    }
    }catch(error){
            return {success:false,value:error}
    }
}

/**
 * Generated new tokens 
 */
async function generateToken(user:any) : Promise<any>
{
    try{
        const jwt = await token("encrypt",{Id: user.dataValues.Id, Username:user.dataValues.Username, Avatar:user.dataValues.Avatar, RoleId: user.dataValues.RoleId});
       // const isJwt = jwt !== undefined ? {success:true,value:{access_token: jwt}} : undefined;
        return jwt;
    }catch(error){
        return error;
    }
}

/**
 * Created new records in the redis
 * @param user object
 */
async function createRedisRecord(user:any, jwt:string) : Promise<any>
{
    try{
        await redis.RedisSetValue("AuthKey"+jwt,{Id: user.dataValues.Id, Username:user.dataValues.Username, Avatar:user.dataValues.Avatar, RoleId: user.dataValues.RoleId})
       // return true; 
    }catch(error){
      console.debug(error);
    }
}

/**
 * Check blocked user
 * @param object 
 */
async function checkingBlockedUserOrNo(object:any) :Promise<any>
{
    const currentUser = await User.findOne({where:{Email:object.Email}})
    const isBlocked = currentUser?.dataValues.IsBlocked  == true ? true : false;
    return isBlocked;  
}

/**
 * Return User db instance 
 */
async function getUserInstance(object:any): Promise<any>
{
    if(await existUserIntoDb(object) !== false)
    {
        const user = await User.findOne({where:{Email:object.Email}});
        const isUser = user instanceof User == true ? user : false; 
        return isUser; 
    }else{
        return {
            success:false,
            values:"User isn't exist"
        }
    }
}

/**
 * Check user exist into db table Users
 * @param object 
 * @returns true/false or exception
 */
async function existUserIntoDb(object:any) : Promise<any>
{
    try{
        const user = await User.findOne({where:{Email:object.Email}});
         return user instanceof User == true ?  true: false; 
    }catch(error){
        return {
            success:false,
            value:error
        };
    }
}

/**
 * Compared password hash
 * @param object 
 * @returns true or false
 */
async function comparePass(object:any) : Promise<boolean>
{
  const user = await User.findOne({where:{Email:object.Email}});
  return bcrypt.compareSync(object.Password,user?.dataValues.Password);
}