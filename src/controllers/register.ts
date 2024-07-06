'use strict';

import { User } from '../models/User';
import Roles from '../models/Roles';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { validateUser } from '../routes/dtos/dto';

dotenv.config();

export async function createUser(object: any, ctx: any) {
    try {
        const isValidate = await validateUser(object);
        if (isValidate instanceof Array)
        {
            ctx.status = 400;
            return { success: false, values: isValidate };
        } else {
            const isUserExist = await userExist(object.email, ctx);
        if (isUserExist)
        { 
            ctx.status = 409; //  HTTP Status Code for inserting duplicate values
            return { success: false, values: "Registration cannot be completed as the user already exists." };
        }else{ 
            const result = await addDbUser(object, ctx); 
            return result;
            }
        }
    } catch (err) {
        ctx.status = 500;
        return { success: false, values: err || "Internal Server Error" };
    }
}

async function addDbUser(object: any, ctx: any): Promise<any> {
    try {
        const rolesId = await findRole("user");
        if (rolesId instanceof Roles) {
            const hashedPassword = bcrypt.hashSync(object.password, 10);
            const userCreate = await User.create({id: uuidv4(), Username: object.username, Email: object.email, roleId: rolesId.dataValues.Id, Password: hashedPassword});
            ctx.status = 201; // HTTP Status Code for Created
            return { success: true, value: "User created successfully" };
        } else {
            ctx.status = 500; // HTTP Status Code with Internal Server Error
            return { success: false, value: 'Failed to attach role. Please try again later.' };
        }
    } catch (err) {
        ctx.status = 500; // HTTP Status Code with Internal Server Error
        return { success: false, value: err};
    }
}

async function findRole(name: string): Promise<any> {
    try {
        const roleGuid = await Roles.findOne({ where: { Name: `${name }` }});
        return roleGuid instanceof Roles ? roleGuid : null;
    } catch (err) {
        return { success: false, value: err || "Internal Server Error" };
    }
}

async function userExist(email: string, ctx: any): Promise<any> {
    try {
        const isUserExist = await User.findOne({ where: { Email: email } });
        if (isUserExist instanceof User) { ctx.status = 409; return {success:false,value:"Registration cannot be completed as the user already exists"}}
        return isUserExist;
    } catch (err) {
        ctx.status = 500; // Internal Server Error
        return { success: false, value: err || "Internal Server Error" };
    }
}
