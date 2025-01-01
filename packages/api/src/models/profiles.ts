import { Profile } from '@prisma/client';
import { RequestBodyDefault } from 'fastify';
import { IProfileRepository } from '../repositories/interfaces.js';

export class ProfileModel {
  constructor(private repository: IProfileRepository) {}

  public async create(data: RequestBodyDefault): Promise<Profile> {
    return this.repository.create(data);
  }

  public async update(id: string, data: any): Promise<Profile> {
    return this.repository.update(id, data);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.repository.findByUserId(userId);
  }
} 
