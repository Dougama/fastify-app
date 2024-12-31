import Fastify from 'fastify';
import healthRoutes from './routes/ping.js';
import cors from './plugins/cors.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import profilesRoutes from './routes/profiles.js';
import postsRoutes from './routes/posts.js';
import configureSwagger from './plugins/swagger.js';

export const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

// Plugins
app.register(cors);
await configureSwagger(app);
// Rutas
app.register(healthRoutes, {prefix: '/health'});
app.register(usersRoutes, {prefix: '/users'});
app.register(authRoutes, {prefix: '/auth'});
app.register(profilesRoutes, {prefix: '/profiles'});
app.register(postsRoutes, {prefix: '/posts'});
