import { FastifyReply, FastifyRequest } from 'fastify';
import { ProfileService } from '../services/profile.js';
import { IProfileRepository } from '../repositories/interfaces.js';
import { PrismaProfileRepository } from '../repositories/prisma/profile.repository.js';
import { NotificationService } from '../services/notifications.js';
import { getPubSubClient } from '@app/services/pubsub/client.js';

const profileRepository = new PrismaProfileRepository();
const profileService = new ProfileService(profileRepository);

export const createProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await profileService.createProfile(req.body as Record<string, any>);
    reply.status(201).send(result);
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error creating profile'});
  }
};

export const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    const result = await profileService.updateProfile(params.id, req.body as Record<string, any>);
    const notificationService = new NotificationService(getPubSubClient());
    await notificationService.sendNotificationProfileUpdated(JSON.stringify(result));
    reply.send(result);
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error updating profile'});
  }
};

export const deleteProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    await profileService.deleteProfile(params.id);
    reply.status(204).send();
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error deleting profile'});
  }
};

export const getProfileByUserId = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    const profile = await profileService.getProfileByUserId(params.userId);
    if (!profile) {
      reply.status(404).send({error: 'Profile not found'});
    } else {
      reply.send(profile);
    }
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error fetching profile'});
  }
};

export const createProfilePhoto = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    const result = await profileService.createProfilePhoto(params.userId, req.body as Record<string, any>);
    reply.send(result);
  } catch (error) {
    req.log.error({error});
    const message = error instanceof Error ? error.message : 'Error creating profile photo';
    reply.status(400).send({error: message});
  }
};
