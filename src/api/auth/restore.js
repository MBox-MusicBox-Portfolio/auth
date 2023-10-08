'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { getUser } from '../../controllers/auth_controller/restore.js';

const router = new Router();
router.use(bodyParser());

router.post('/api/auth/restore', async (ctx)=>{
    await getUser(ctx.request.body,ctx); 
});


export default router;