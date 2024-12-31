import { Post } from '@prisma/client';
import { getPrisma } from '../db.js';

const prisma = getPrisma();

export class PostModel {
  public async getAll(): Promise<Post[]> {
    return prisma.post.findMany({
      include: { author: true }
    });
  }

  public async getById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });
  }

  public async create(data: {[key: string]: any}): Promise<Post> {
    return prisma.post.create({ data } as any);
  }

  public async update(id: string, data: Partial<Post>): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  public async getByAuthor(authorId: string): Promise<Post[]> {
    return prisma.post.findMany({
      where: { authorId },
      include: { author: true }
    });
  }
}
