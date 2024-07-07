import Router from "@koa/router";
import {bodyParser} from '@koa/bodyparser';
import {createUser} from "../controllers/register";
import {authUser} from "../controllers/auth";

const router: Router = new Router({
    prefix: '/api'
});

router.use(bodyParser());

/**
 * Check status of microservice
 */
router.get('/', async (ctx) => {
    ctx.status = 200
    ctx.body = "I am working"
})

/**
 * Authorization new user
 */

router.post('/auth', async (ctx) => {
    ctx.status = 200
    ctx.body = await authUser(ctx.request.body, ctx);
})

/**
 * Create new user
 */
router.post('/register', async (ctx) => {
    ctx.status = 200
    ctx.body = await createUser(ctx.request.body, ctx)
})

/**
 * Logout user
 */
router.delete('/logout', async (ctx) => {
    ctx.status = 200
    ctx.body = ""
    // TODO: set headers to remove cookies from browser, block jwt token or delete it from whitelist
});

export default router;