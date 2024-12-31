import {FastifyReply, FastifyRequest} from 'fastify';
import {PostModel} from '../models/post.js';

const postModel = new PostModel();

export const getPosts = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const posts = await postModel.getAll();
    reply.send(posts);
  } catch (error) {
    reply.status(500).send({error: 'Error fetching posts'});
  }
};

export const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as Record<string, any>;
  try {
    const post = await postModel.getById(params.id);
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
  const body = req.body as Record<string, any>;
  try {
    const post = await postModel.create(body);
    reply.status(201).send({created: true, id: post.id});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error creating post'});
  }
};

export const updatePost = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as Record<string, any>;
  const body = req.body as Record<string, any>;
  try {
    const post = await postModel.update(params.id, body);
    reply.send({updated: true});
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error updating post'});
  }
};

export const deletePost = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = req.params as Record<string, any>;
  try {
    await postModel.delete(params.id);
    reply.status(204).send();
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error deleting post'});
  }
};

export const getPostsByAuthor = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const params = req.params as Record<string, any>;
  try {
    const posts = await postModel.getByAuthor(params.authorId);
    reply.send(posts);
  } catch (error) {
    req.log.error({error});
    reply.status(500).send({error: 'Error fetching author posts'});
  }
};
