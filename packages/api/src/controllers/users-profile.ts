import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import {ProfileModel} from '../models/profiles.js';
import {publicImageUrl} from '@app/services/storage/save-image.js';
import {logger} from '@app/utils/logger.js';

const profileModel = new ProfileModel();

export const createProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = req.body as Record<string, any>;
  try {
    const profile = await profileModel.create(body);
    reply.status(201).send({created: true, id: profile.id});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error creating profile'});
  }
};

export const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as Record<string, any>;
  const body = req.body as Record<string, any>;
  try {
    await profileModel.update(params.id, body);
    reply.send({updated: true});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error updating profile'});
  }
};

export const deleteProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as Record<string, any>;
  try {
    await profileModel.delete(params.id);
    reply.status(204).send();
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error deleting profile'});
  }
};

export const getProfileByUserId = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as Record<string, any>;
  try {
    const profile = await profileModel.getProfileByUserId(params.userId);
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
  const params = req.params as Record<string, any>;
  const body = req.body as Record<string, any>;
  const url = await publicImageUrl(body.image, params.userId);
  if (!url) {
    logger.error('Error saving image');
    return reply.status(400).send({error: 'Error saving image'});
  }
  const existingProfile = await profileModel.getProfileByUserId(params.userId);
  if (existingProfile) {
    await profileModel.update(existingProfile.id, {image: url});
  } else {
    await profileModel.create({userId: params.userId, image: url, bio: ''});
  }
  return reply.send({url});
};
