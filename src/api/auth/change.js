'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { isAuth } from '../../middleware/isAuth.js';
import { getRequest } from '../../controllers/auth_controller/change.js';

const router = new Router();
router.use(bodyParser());

router.post('/api/auth/change', isAuth, async (ctx)=>{
    await getRequest(ctx.body);
});

export default router;

