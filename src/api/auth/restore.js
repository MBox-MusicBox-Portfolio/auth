'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { newPass } from '../../controllers/auth_controller/forgotten.js';
const router = new Router();
router.use(bodyParser());

router.get('/api/auth/restore', async (ctx)=>{
    let userIndeficate = await newPass(ctx.query,ctx); 
    console.log(ctx.query); 
});


export default router;