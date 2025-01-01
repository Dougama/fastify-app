import { Profile, User, Post } from '@prisma/client'

export interface IProfileRepository {
  create(data: any): Promise<Profile>
  update(id: string, data: any): Promise<Profile>
  delete(id: string): Promise<void>
  findByUserId(userId: string): Promise<Profile | null>
}

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
  create(data: any): Promise<User>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
  findByEmail(email: string): Promise<User | null>
}

export interface IPostRepository {
  findAll(): Promise<Post[]>
  findById(id: string): Promise<Post | null>
  create(data: any): Promise<Post>
  update(id: string, data: Partial<Post>): Promise<Post>
  delete(id: string): Promise<void>
  findByAuthor(authorId: string): Promise<Post[]>
} 
