import { Post } from '@prisma/client';
import { IPostRepository } from '../repositories/interfaces.js';

export class PostModel {
  constructor(private repository: IPostRepository) {}

  public async getAll(): Promise<Post[]> {
    return this.repository.findAll();
  }

  public async getById(id: string): Promise<Post | null> {
    return this.repository.findById(id);
  }

  public async create(data: {[key: string]: any}): Promise<Post> {
    return this.repository.create(data);
  }

  public async update(id: string, data: Partial<Post>): Promise<Post> {
    return this.repository.update(id, data);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getByAuthor(authorId: string): Promise<Post[]> {
    return this.repository.findByAuthor(authorId);
  }
}
