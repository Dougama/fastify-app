import {FastifyReply, FastifyRequest} from 'fastify';

export function authorize(requiredRoles: string[]) {
  return (
    request: FastifyRequest,
    reply: FastifyReply,
    done: Function
  ): void => {
    const user = request.user;
    if (!user || !requiredRoles.includes(user.role)) {
      reply.code(403).send({error: 'Forbidden'});
      return;
    }
    done();
  };
}
