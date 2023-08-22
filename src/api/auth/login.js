'use strict'
import Router from 'koa-router';
import {validationLoginForm} from '../../controllers/auth_controller/login.js';
import bodyParser from 'koa-bodyparser';

const router = new Router();
router.use(bodyParser());

router.post('/api/auth/login', async (ctx) => {
try {
      await validationLoginForm(ctx.request.body,ctx)
}catch(ex){
     ctx.status=500;
     ctx.body= JSON.stringify({success: "false", 
                               description: `${ex}`});
}
});


export default router;
