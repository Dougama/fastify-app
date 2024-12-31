import {User} from '@prisma/client';
import {getPrisma} from '../db.js';

const prisma = getPrisma();
export class UserModel {
  public async getAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  public async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({where: {id}});
  }

  public async create(data: {[key: string]: any}): Promise<User> {
    return prisma.user.create({data} as any);
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({where: {id}, data});
  }

  public async delete(id: string): Promise<void> {
    await prisma.user.delete({where: {id}});
  }

  public async getByCredentials(email: string): Promise<User | null> {
    return prisma.user.findUnique({where: {email}});
  }
}
