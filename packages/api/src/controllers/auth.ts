import {FastifyReply, FastifyRequest} from 'fastify';
import {UserModel} from '../models/users.js';
import {comparePassword} from '@app/utils/basic_auth/hash_pass.js';
import {generateToken} from '@app/utils/jwt/generate_jwt.js';
import {PrismaUserRepository} from '../repositories/prisma/user.repository.js';

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const {email, password} = request.body as {
    email: string;
    password: string;
  };

  const userRepository = new PrismaUserRepository();
  const userModel = new UserModel(userRepository);

  const user = await userModel.getByCredentials(email);
  const savedPassword = user?.password as string;
  const isPasswordValid = comparePassword(password, savedPassword);

  if (!user || !isPasswordValid) {
    reply.code(401).send({error: 'Invalid credentials'});
    return;
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });
  reply.send({token});
}
