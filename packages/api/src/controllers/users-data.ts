import {FastifyReply, FastifyRequest, RequestBodyDefault} from 'fastify';
import {UserModel} from '../models/users.js';
import { hashPassword } from '@app/utils/basic_auth/hash_pass.js';

const userModel = new UserModel();

export const getUsers = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = (await userModel.getAll()).map(({password, ...user}) => user);
    reply.send(users);
  } catch (error) {
    reply.status(500).send({error: 'Error fetching users'});
  }
};

export const getUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const params = req.params as {[key: string]: string}
    const user = await userModel.getById(params.id);
    if (!user) {
      reply.status(404).send({error: 'User not found'});
    } else {
      const {password, ...userWithoutPassword} = user;
      reply.send(userWithoutPassword);
    }
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error fetching user'});
  }
};

export const createUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = req.body as {[key: string]: any};
    data.password = hashPassword(data.password);
    const user = await userModel.create(req.body as any);
    const {password, ...userWithoutPassword} = user;
    reply.status(201).send({created: true, ...userWithoutPassword});
  } catch (error) {
    console.log(error);
    req.log.error({error});
    reply.status(500).send({error: 'Error creating user'});
  }
};

export const updateUser = async (
  req: FastifyRequest<{
    Params: {id: string};
    Body: {name?: string; email?: string};
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await userModel.update(req.params.id, req.body);
    reply.send({updated: true});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error updating user'});
  }
};

export const deleteUser = async (
  req: FastifyRequest<{Params: {id: string}}>,
  reply: FastifyReply
) => {
  try {
    await userModel.delete(req.params.id);
    reply.status(204).send();
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error deleting user'});
  }
};
