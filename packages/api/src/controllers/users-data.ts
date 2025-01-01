import {FastifyReply, FastifyRequest} from 'fastify';
import {UserService} from '../services/users.js';
import {PrismaUserRepository} from '../repositories/prisma/user.repository.js';
import {NotificationService} from '../services/notifications.js';
import {getPubSubClient} from '@app/services/pubsub/client.js';

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

export const getUsers = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.getAllUsers();
    reply.send(users);
  } catch (error) {
    reply.status(500).send({error: 'Error fetching users'});
  }
};

export const getUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as {[key: string]: string};
    const user = await userService.getUserById(params.id);
    if (!user) {
      reply.status(404).send({error: 'User not found'});
    } else {
      reply.send(user);
    }
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error fetching user'});
  }
};

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await userService.createUser(req.body as any);
    const notificationService = new NotificationService(getPubSubClient());
    await notificationService.sendNotificationUserCreated(JSON.stringify(user));
    reply.status(201).send({created: true, ...user});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error creating user'});
  }
};

export const updateUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const params = req.params as {[key: string]: string};
    const body = req.body as {[key: string]: string};
    await userService.updateUser(params.id, body);
    const notificationService = new NotificationService(getPubSubClient());
    await notificationService.sendNotificationUserUpdated(JSON.stringify(body));
    reply.send({updated: true});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error updating user'});
  }
};

export const deleteUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const params = req.params as {[key: string]: string};
    await userService.deleteUser(params.id);
    reply.status(204).send();
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error deleting user'});
  }
};
