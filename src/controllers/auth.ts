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
                    const jwt = await token("encrypt",{id: user.dataValues.id, username:user.dataValues.usernames, avatar:user.dataValues.avatars, rolesId: user.dataValues.rolesId});
                    await redis.RedisSetValue("AuthKey"+jwt,{id: user.dataValues.id, username:user.dataValues.usernames, avatar:user.dataValues.avatars, rolesId: user.dataValues.rolesId})
                    return {success:true,value:{access_token: jwt}};
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
 * Check blocked user
 * @param object 
 */
async function checkingBlockedUserOrNo(object:any) :Promise<any>
{
    const currentUser = await User.findOne({where:{emails:object.email}})
    const isBlocked = currentUser?.dataValues.isBlockeds  > 0? true : false;
    return isBlocked;  
}

/**
 * 
 */
async function getUserInstance(object:any): Promise<any>
{
    if(await existUserIntoDb(object) !== false)
    {
        const user = await User.findOne({where:{emails:object.email}});
        const isUser = user instanceof User == true ? user : false; 
        return isUser; 
    }else{
        console.log({success:false,values:"User isn't exist"})
    }
}

/**
 * Ch
 * @param object 
 * @returns 
 */
async function existUserIntoDb(object:any) : Promise<any>
{
    try{
        const user = await User.findOne({where:{emails:object.email}});
         return user instanceof User == true ?  true: false; 
    }catch(error){
        return {success:false,value:error};
    }
}

async function comparePass(object:any) : Promise<boolean>
{
  const user = await User.findOne({where:{emails:object.email}});
  return bcrypt.compareSync(object.password,user?.dataValues.passwords);
}