import { User } from '@prisma/client'
import { IUserRepository } from '../repositories/interfaces.js'

export class UserModel {
  constructor(private repository: IUserRepository) {}

  public async getAll(): Promise<User[]> {
    return this.repository.findAll()
  }

  public async getById(id: string): Promise<User | null> {
    return this.repository.findById(id)
  }

  public async create(data: {[key: string]: any}): Promise<User> {
    return this.repository.create(data)
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    return this.repository.update(id, data)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  public async getByCredentials(email: string): Promise<User | null> {
    return this.repository.findByEmail(email)
  }
}
