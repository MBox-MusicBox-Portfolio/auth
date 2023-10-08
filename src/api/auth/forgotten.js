'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {getUser} from '../../controllers/auth_controller/forgotten.js';
const router = new Router();
router.use(bodyParser());

router.post('/api/auth/forgotten', async (ctx) => {
console.log("Restore pass");
try {
    ctx.status=200;
    ctx.body = await getUser(ctx.request.body,ctx);
}catch(ex){
     ctx.status=500;
     ctx.body= JSON.stringify({success: "false", messages: `${ex}`});
   }
});

export default router;
