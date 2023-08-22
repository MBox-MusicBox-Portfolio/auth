import dotenv from 'dotenv';
import { decodeJWT } from '../../modules/token.js';
import { isAuth } from '../../middleware/isAuth.js';
import User from '../../models/user.js';
dotenv.config();

let requestData = {
    token: "", 
    newPassword: ""
}

export async function getUser()
{
    let decode = decodeJWT(user.token); 
    try{
        let user = User.findOne({where:{Id:decode.Id}, attributes:{Password}});
         user.Password= requestData.newPassword;
        let status = await user.save();
        //status === 1 ? ctx.body = JSON.stringify({success:true, value:{password: "Password update"}}) : ctx.body = JSON.stringify({success=false, value:{password:"Password not update"}});     
    }catch(ex){
         console.error(ex);
    } 
}

export async function getRequest(context,ctx)
{
    if(context){
        console.log(context);
       ctx.status=200; 
       data = context.body.request;
       user.token = data.Token;
       user.newPassword = data.Password;
    }else{
        ctx.status=400;
        return JSON.stringify({
            request:false,
            value:"User not found"
        })
    }
}