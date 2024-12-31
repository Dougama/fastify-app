import {FastifyInstance} from 'fastify';

import {authenticate} from '../middleware/auth.js';
import {
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor,
} from '../controllers/user-post.js';
import {
  createPostSchema,
  updatePostSchema,
  postParamsSchema,
} from '@app/utils/schemas/post.js';

export default async function postsRoutes(app: FastifyInstance) {
  app.get('/', {preHandler: [authenticate]}, getPost);
  app.get(
    '/:id',
    {
      schema: postParamsSchema,
      preHandler: [authenticate],
    },
    getPost
  );
  app.post(
    '/',
    {
      schema: createPostSchema,
      preHandler: [authenticate],
    },
    createPost
  );
  app.put(
    '/:id',
    {
      schema: {...updatePostSchema, ...postParamsSchema},
      preHandler: [authenticate],
    },
    updatePost
  );
  app.delete(
    '/:id',
    {
      schema: postParamsSchema,
      preHandler: [authenticate],
    },
    deletePost
  );
  app.get('/author/:authorId', {preHandler: [authenticate]}, getPostsByAuthor);
}
