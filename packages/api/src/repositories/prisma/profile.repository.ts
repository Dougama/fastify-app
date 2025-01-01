import { Profile } from '@prisma/client'
import { IProfileRepository } from '../interfaces.js'
import { getPrisma } from '../../services/db.js'

export class PrismaProfileRepository implements IProfileRepository {
  private prisma = getPrisma()

  async create(data: any): Promise<Profile> {
    return this.prisma.profile.create({ data })
  }

  async update(id: string, data: any): Promise<Profile> {
    return this.prisma.profile.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.profile.delete({ where: { id } })
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: { user: true }
    })
  }
} 
