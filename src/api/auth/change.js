'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import isAuth  from '../../middleware/isAuth.js';
import {changePassword, getUser } from '../../controllers/auth_controller/change.js';

const router = new Router();
router.use(bodyParser());

router.post('/api/auth/change', async (ctx)=>{
   try{
    if(await isAuth(ctx) !== null)
    {
        await changePassword(ctx.request.body.Token, ctx.request.body.oldPassword, ctx.request.body.newPassword);
        ctx.status=200; 
        ctx.body={
            success:true,
            value:{
                message:"Password changed successfull!" 
            }
        }
    }else{
        console.error("Abort");
    }
   }catch(ex){
     ctx.status=500;
     ctx.body={
        success:false,
        value:{
            changePassword:{
                error:`[${new Date().toLocaleString()} : Change API Password: ${ex}]`
            }
        }
     }
   }
    
});

export default router;
