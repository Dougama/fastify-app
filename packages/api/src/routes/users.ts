import {FastifyInstance} from 'fastify';
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from '@app/utils/schemas/users.js';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/users-data.js';
import {authenticate} from '../middleware/auth.js';
import {authorize} from '../middleware/role.js';

export default async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [authenticate, authorize(['admin'])],
      schema: createUserSchema,
    },
    createUser
  );
  app.get('/', {preHandler: [authenticate]}, getUsers);
  app.get(
    '/:id',
    {preHandler: [authenticate], schema: userParamsSchema},
    getUser
  );
  app.put(
    '/:id',
    {preHandler: [authenticate], schema: updateUserSchema},
    updateUser
  );
  app.delete(
    '/:id',
    {preHandler: [authenticate], schema: userParamsSchema},
    deleteUser
  );
}
