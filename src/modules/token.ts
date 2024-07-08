import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import {JwtPayload} from "jsonwebtoken";

dotenv.config();

const encrypt = (user: any): string => {
    return jwt.sign({data: user}, `${process.env.JWT_SECRET}`, {
        audience: `${process.env.JWT_AUDIENCE}`,
        issuer: `${process.env.JWT_ISSUER}`,
        expiresIn: '30d'
    });
}

const decode = (token: string): JwtPayload => {
    return jwt.verify(token, `${process.env.JWT_SECRET}`);
}

export async function token(operation: string, data: any): Promise<any> {
    if (`${process.env.JWT_SECRET}` || `${process.env.JWT_AUDIENCE}` || `${process.env.JWT_ISSUER}`) {
        switch (operation) {
            case "encrypt" :
                const token = encrypt(data);
                return typeof (token) == "string" ? token : undefined;
            case "decrypt" :
                return typeof (data) == "string" ? decode(data) : "Token module :: Token must be a string ";
            default:
                return "Token module :: Unknown operation";
        }
    } else {
        throw new Error("Token Module::Global variable isn't set");
    }
}

export default token;