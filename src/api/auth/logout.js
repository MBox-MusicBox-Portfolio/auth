'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {logout} from '../../controllers/auth_controller/logout.js';
const router = new Router();
router.use(bodyParser());

router.post('/api/auth/logout', async (ctx)=>{
    await logout(ctx.request.body.Token);
});

export default router;