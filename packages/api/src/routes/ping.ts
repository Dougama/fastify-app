import {FastifyInstance} from 'fastify';

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/ping', async () => {
    return 'pong---';
  });
}
