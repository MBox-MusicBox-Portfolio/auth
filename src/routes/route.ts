import Router from "@koa/router";
import { bodyParser} from '@koa/bodyparser';
import { createNewUser } from "../controllers/auth/register.controller";
import { authUser } from "../controllers/auth/auth.controller";
import { koaSwagger } from 'koa2-swagger-ui';
import swaggerDocGenerator from 'swagger-jsdoc';
import { AuthUtil } from "../utils/auth/AuthUtil.utils";
import { AuthMessages } from "../utils/messages/AuthMessage.enum";
import { logoutUser } from "../controllers/auth/logout.controller";
import { confirmUserEmail } from "../controllers/auth/emailConfirm.controller";

const router: Router = new Router();
const options = {
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'API Auth documentation',
        version: '1.0.0',
      },
    },
    apis: ['./src/routes/*.ts'],
};

const openapiSpecification = swaggerDocGenerator(options);
router.use(bodyParser());

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return a JWT Token
 *       400:
 *         description: Returns an object containing validation errors. 
 *       401:
 *         description: Invalid credentials provided.
 */
router.post('/api/auth/login', async (ctx) => {
    try{
      ctx.body = await authUser(ctx);
    }catch(err:any)
    {
      ctx.body = AuthUtil.handleInternalServerError(AuthMessages.InternalServerError,ctx);
    }
});

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type:string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 *       400:
 *         description: Returns an object containing validation errors. 
 */
router.post('/api/auth/register', async (ctx) => {
    ctx.body = await createNewUser(ctx);
});



/**
 * @openapi
 * /api/auth/logout:
 *   delete:
 *     summary: Logout user
 *     description: Logout the user.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         description: Bearer token for logout.
 *         schema:
 *           type: string
 *           example: Bearer <your_token>
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       400: 
 *         description: Returns an object containing validation errors.
 *       500:
 *         description: Internal server error. 
 */
router.delete('/api/auth/logout', async (ctx) => {
    ctx.body = await logoutUser(ctx);
});


router.get('/api/auth/confirmEmail/:token', async (ctx) => {
    ctx.body = await confirmUserEmail(ctx);
});

router.get('/api/auth/docs', koaSwagger({
    title:"Auth API",
    routePrefix: false,
    swaggerOptions: {
      spec: openapiSpecification as Record<string, unknown>
    }
  }));
export default router;
