'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {confirmEmail} from '../../controllers/auth_controller/email.js';
const router = new Router();
router.use(bodyParser());

router.get('/api/auth/emailConfirm', async (ctx)=>{
   await confirmEmail(ctx.query,ctx);
});

export default router;
