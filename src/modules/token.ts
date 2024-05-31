import * as jwt  from 'jsonwebtoken'; 
import * as dotenv from 'dotenv';
dotenv.config();

const encrypt = async (user: any) => {
    const token = await jwt.sign({ data: user }, `${process.env.JWT_SECRET}`, {
          audience: `${process.env.JWT_AUDIENCE}`,
          issuer:   `${process.env.JWT_ISSUER}`,
          expiresIn: '30d'});
    return token;
}

const decode = async (token: string) => {
    const decoded = await jwt.verify(token,`${process.env.JWT_SECRET}`);
    return decoded;
}

export async function token(operation:string , data:any) : Promise<any>
{
    if (`${process.env.JWT_SECRET}` || `${process.env.JWT_AUDIENCE}` || `${process.env.JWT_ISSUER}`) 
    {
        switch(operation)
        {
           case "encrypt" : 
              const token = await encrypt(data); 
              return typeof(token) == "string" ? token : undefined; break;
           case "decrypt" : 
              return typeof(data)  == "string" ? await decode(data) : "Token module :: Token must be a string "; break;
           default: 
              return "Token module :: Unknown operation"; 
        } 
    }else{
        throw new Error("Token Module::Global variable isn't set");
    }
}

export default token;