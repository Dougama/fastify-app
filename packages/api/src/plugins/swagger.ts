import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {FastifyInstance} from 'fastify';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function configureSwagger(app: FastifyInstance) {
  const swaggerFile = path.join(__dirname, '../../docs/swagger.yaml');
  const swaggerDocument = yaml.load(
    fs.readFileSync(swaggerFile, 'utf8')
  ) as object;

  await app.register(fastifySwagger, {
    openapi: swaggerDocument,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
  });
}
