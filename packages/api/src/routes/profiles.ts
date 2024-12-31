import {FastifyInstance} from 'fastify';
import {
  createProfile,
  updateProfile,
  getProfileByUserId,
  createProfilePhoto,
} from '../controllers/users-profile.js';
import {authenticate} from '../middleware/auth.js';
import {
  createProfileSchema,
  updateProfileSchema,
  profileParamsSchema,
  profilePhotoParamsSchema,
} from '@app/utils/schemas/profile.js';

export default async function profilesRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: createProfileSchema,
      preHandler: [authenticate],
    },
    createProfile
  );
  app.put(
    '/:userId',
    {
      schema: {...updateProfileSchema, ...profileParamsSchema},
      preHandler: [authenticate],
    },
    updateProfile
  );
  app.get(
    '/user/:userId',
    {
      schema: profileParamsSchema,
      preHandler: [authenticate],
    },
    getProfileByUserId
  );
  app.post(
    '/photo/:userId',
    {
      schema: profilePhotoParamsSchema,
      preHandler: [authenticate],
    },
    createProfilePhoto
  );
}
