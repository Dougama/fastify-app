import Fastify, {FastifyInstance} from 'fastify';
import healthRoutes from './routes/ping.js';
import cors from './plugins/cors.js';
import usersRoutes from './routes/users.js';

// import swagger from './plugins/swagger';
// import healthRoutes from '';
// import userRoutes from './routes/users';

export const createApp = (): FastifyInstance => {
  const app = Fastify({
    logger: true,
  });

  // Plugins
  app.register(cors);
  // app.register(swagger);

  // Rutas
  app.register(healthRoutes, {prefix: '/health'});
  app.register(usersRoutes, {prefix: '/users'});

  return app;
};
