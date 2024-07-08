'use strict'
import {User} from '../models/User';
import bcrypt from 'bcrypt';
import * as redis from '../modules/redis';
import {token} from '../modules/token';
import {validateAuth} from '../routes/dtos/dto';

/**
 * Auth function
 * @param object
 * @param ctx
 */
export async function authUser(object: any, ctx: any): Promise<any> {
    try {
        const authFormValidation = await validateAuth(object);

        if (authFormValidation) {
            const user = await User.findOne({where: {Email: object.email}});

            if (user) {
                const isPasswordCorrect = await comparePass(user, object)

                if (!isPasswordCorrect) {
                    ctx.status = 400;
                    return ({errors: ["Incorrect password"]});
                }

                if (user.dataValues.IsBlocked) {
                    ctx.status = 403;
                    return {errors: ["You were banned"]}
                }

                ctx.status = 200;
                const jwt = await generateToken(user);
                await createRedisRecord(user, jwt);
                return {value: {accessToken: jwt}}
            } else {
                ctx.status = 400;
                return {errors: ["User doesn't exist"]};
            }
        } else {
            ctx.status = 400;
            return {errors: [authFormValidation]}
        }
    } catch (error) {
        ctx.status = 500;
        return {errors: [error]}
    }
}

/**
 * Generated new tokens
 */
async function generateToken(user: any): Promise<any> {
    // const isJwt = jwt !== undefined ? {success:true,value:{access_token: jwt}} : undefined;
    return await token("encrypt", {
        id: user.dataValues.Id,
        username: user.dataValues.Username,
        avatar: user.dataValues.Avatar,
        roleId: user.dataValues.RoleId
    });

}

/**
 * Created new records in the redis
 * @param user object
 * @param jwt
 */
async function createRedisRecord(user: any, jwt: string): Promise<any> {
    try {
        await redis.RedisSetValue("AuthKey" + jwt, {
            id: user.dataValues.Id,
            username: user.dataValues.Username,
            avatar: user.dataValues.Avatar,
            roleId: user.dataValues.RoleId
        })
        // return true;
    } catch (error) {
        console.debug(error);
    }
}

/**
 * Compared password hash
 * @param user
 * @param object
 * @returns true or false
 */
async function comparePass(user: any, object: any): Promise<boolean> {
    return bcrypt.compare(object.password, user?.dataValues.Password);
}
