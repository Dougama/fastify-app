import { Profile } from '@prisma/client';
import { getPrisma } from '../db.js';
import { RequestBodyDefault } from 'fastify';

const prisma = getPrisma();

export class ProfileModel {
  public async create(data: RequestBodyDefault): Promise<Profile> {
    return prisma.profile.create({ data } as any);
  }

  public async update(id: string, data: any): Promise<Profile> {
    return prisma.profile.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.profile.delete({ where: { id } });
  }

  public async getProfileByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { userId },
      include: { user: true }
    });
  }
} 
