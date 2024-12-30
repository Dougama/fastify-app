import {FastifyInstance} from 'fastify';
import {UserController} from '../controllers/users_data.js';
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from '../schemas/users.js';

export default async function usersRoutes(app: FastifyInstance) {
  const controller = new UserController();
  app.post(
    '/',
    {schema: createUserSchema},
    controller.createUser.bind(controller)
  );
  app.get('/', {}, controller.getAllUsers.bind(controller));
  app.get(
    '/:id',
    {schema: userParamsSchema},
    controller.getUserById.bind(controller)
  );
  app.put(
    '/:id',
    {schema: updateUserSchema},
    controller.updateUser.bind(controller)
  );
  app.delete(
    '/:id',
    {schema: userParamsSchema},
    controller.deleteUser.bind(controller)
  );
}
