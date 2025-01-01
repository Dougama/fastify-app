import {FastifyReply, FastifyRequest} from 'fastify';
import {PostService} from '../services/post.js';
import { PrismaPostRepository } from '../repositories/prisma/post.repository.js';
import { NotificationService } from '../services/notifications.js';
import { getPubSubClient } from '@app/services/pubsub/client.js';

const postRepository = new PrismaPostRepository();
const postService = new PostService(postRepository);

export const getPosts = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const posts = await postService.getAllPosts();
    reply.send(posts);
  } catch (error) {
    reply.status(500).send({error: 'Error fetching posts'});
  }
};

export const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    const post = await postService.getPostById(params.id);
    if (!post) {
      reply.status(404).send({error: 'Post not found'});
    } else {
      reply.send(post);
    }
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error fetching post'});
  }
};

export const createPost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await postService.createPost(req.body as Record<string, any>);
    const notificationService = new NotificationService(getPubSubClient());
    await notificationService.sendNotificationPostCreated(JSON.stringify(result));
    reply.status(201).send(result);
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error creating post'});
  }
};

export const updatePost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    const result = await postService.updatePost(params.id, req.body as Record<string, any>);
    reply.send(result);
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error updating post'});
  }
};

export const deletePost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    await postService.deletePost(params.id);
    reply.status(204).send();
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error deleting post'});
  }
};

export const getPostsByAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as Record<string, any>;
    const posts = await postService.getPostsByAuthor(params.authorId);
    reply.send(posts);
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error fetching author posts'});
  }
};
