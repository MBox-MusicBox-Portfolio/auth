'use strict';

import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv';
import {UniqueConstraintError} from "sequelize";
import {User} from '../models/User';
import Roles from '../models/Roles';
import {validateUser} from '../routes/dtos/dto';

dotenv.config();

export async function createUser(object: any, ctx: any) {
    const validationResult = await validateUser(object);
    if (validationResult instanceof Array) {
        ctx.status = 400;
        return {errors: validationResult};
    }

    try {
        return createUserModel(object, ctx);
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            ctx.status = 409; //  HTTP Status Code for inserting duplicate values
            return {values: "User already exists"};
        }

        throw err;
    }
}

async function createUserModel(dto: any, ctx: any): Promise<any> {
    const role = await findRole("user");
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await User.create({
        id: uuidv4(),
        Username: dto.username,
        Email: dto.email,
        roleId: role.Id,
        Password: hashedPassword
    });
    ctx.status = 201; // HTTP Status Code for Created
    return {value: "User created successfully"};
}

async function findRole(name: string): Promise<any | null> {
    const role = await Roles.findOne({where: {Name: name}});
    return role ?? null;
}
