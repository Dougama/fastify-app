import { User } from '@prisma/client'
import { IUserRepository } from '../interfaces.js'
import { getPrisma } from '../../services/db.js'

export class PrismaUserRepository implements IUserRepository {
  private prisma = getPrisma()

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async create(data: any): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }
} 
