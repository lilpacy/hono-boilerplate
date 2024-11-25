import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { AuthController } from './controllers/AuthController'

const routes = new Hono()

routes.get('/users', async (c) => {
    const users = await AuthController.getUsers();
    return c.json(users, 200);
});

export default routes
