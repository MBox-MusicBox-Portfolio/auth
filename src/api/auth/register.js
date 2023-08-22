'use strict'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {validationRegisterForm} from '../../controllers/auth_controller/register.js';
const router = new Router();
router.use(bodyParser());

router.post('/api/auth/register', async (ctx, next) => {  
  try {
    const newUser =  await validationRegisterForm(ctx.request.body, ctx);
  } catch (errors) {
      console.error(errors);
  } 
 });
export default router;
