import {FastifyInstance} from 'fastify';
import {getTokenSchema} from '@app/utils/schemas/auth.js';
import {loginController} from '../controllers/auth.js';

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: getTokenSchema,
    },
    loginController
  );
}
