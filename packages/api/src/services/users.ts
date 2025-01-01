import {IUserRepository} from '../repositories/interfaces.js';
import {hashPassword} from '@app/utils/basic_auth/hash_pass.js';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(({password, ...user}) => user);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const {password, ...userWithoutPassword} = user;
    return userWithoutPassword;
  }

  async createUser(userData: {name: string; email: string; password: string}) {
    const hashedPassword = hashPassword(userData.password);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const {password, ...userWithoutPassword} = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, userData: {name?: string; email?: string}) {
    const user = await this.userRepository.update(id, userData);
    const {password, ...userWithoutPassword} = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id);
  }
}
