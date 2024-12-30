import {FastifyReply, FastifyRequest} from 'fastify';
import {UserModel} from '../models/users.js';

export class UserController {
  private model: UserModel;

  constructor() {
    this.model = new UserModel();
  }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.model.create(request.body);
    return reply.status(201).send(user);
  }

  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.model.findById(
      (request.params as {[key: string]: string}).id
    );
    if (!user) {
      return reply.status(404).send({message: 'User not found'});
    }
    return reply.send(user);
  }

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.model.findAll();
    return reply.send(users);
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.model.update(
      (request.params as {[key: string]: string}).id,
      request.body
    );
    if (!user) {
      return reply.status(404).send({message: 'User not found'});
    }
    return reply.send(user);
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const deleted = await this.model.delete(
      (request.params as {[key: string]: string}).id
    );
    if (!deleted) {
      return reply.status(404).send({message: 'User not found'});
    }
    return reply.status(204).send();
  }
}
