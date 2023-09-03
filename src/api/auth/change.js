'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import isAuth  from '../../middleware/isAuth.js';
import {changePassword, getUser } from '../../controllers/auth_controller/change.js';

const router = new Router();
router.use(bodyParser());

router.post('/api/auth/change', async (ctx)=>{
    if(await isAuth(ctx) === true)
    {
        await changePassword(ctx.request.body.Token, ctx.request.body.oldPassword, ctx.request.body.newPassword);
    }else{
        console.error("Abort");
    }
});

export default router;
