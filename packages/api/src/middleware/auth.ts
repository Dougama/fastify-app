import {verifyToken} from '@app/utils/jwt/verify_token.js';
import {FastifyReply, FastifyRequest} from 'fastify';

export interface UserPayload {
  id: number;
  role: string;
  email: string;
}

export function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    reply.code(401).send({error: 'Unauthorized'});
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const user = verifyToken<UserPayload>(token);
    request.user = user;
    done();
  } catch (err) {
    reply.code(401).send({error: 'Invalid token'});
  }
}
