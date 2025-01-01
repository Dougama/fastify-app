import { Post } from '@prisma/client'
import { IPostRepository } from '../interfaces.js'
import { getPrisma } from '../../services/db.js'

export class PrismaPostRepository implements IPostRepository {
  private prisma = getPrisma()

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: { author: true }
    })
  }

  async findById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true }
    })
  }

  async create(data: any): Promise<Post> {
    return this.prisma.post.create({ data })
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } })
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      include: { author: true }
    })
  }
} 
