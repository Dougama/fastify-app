import { PostModel } from '../models/post.js';
import { IPostRepository } from '../repositories/interfaces.js';

export class PostService {
  private postModel: PostModel;

  constructor(private repository: IPostRepository) {
    this.postModel = new PostModel(repository);
  }

  async getAllPosts() {
    return await this.postModel.getAll();
  }

  async getPostById(id: string) {
    return await this.postModel.getById(id);
  }

  async createPost(postData: Record<string, any>) {
    const post = await this.postModel.create(postData);
    return { created: true, id: post.id };
  }

  async updatePost(id: string, postData: Record<string, any>) {
    await this.postModel.update(id, postData);
    return { updated: true };
  }

  async deletePost(id: string) {
    return await this.postModel.delete(id);
  }

  async getPostsByAuthor(authorId: string) {
    return await this.postModel.getByAuthor(authorId);
  }
}
