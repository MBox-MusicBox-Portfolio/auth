'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {SendMessage} from '../../controllers/auth_controller/forgotten.js';
const router = new Router();
router.use(bodyParser());

router.post('/api/auth/forgotten', async (ctx) => {
try {
    let userEmail = await SendMessage(ctx.request.body,ctx);
}catch(ex){
     ctx.status=500;
     ctx.body= JSON.stringify({success: "false", 
                               description: `${ex}`});
}
});


export default router;
