export class UserModel {
  private users = new Map<string, any>();

  async create(userData: any) {
    const user = { ...userData };
    this.users.set('', user); // revisar como se gestiona esto con el orm
    return user;
  }

  async findById(id: string) {
    return this.users.get(id) || null;
  }

  async findAll() {
    return Array.from(this.users.values());
  }

  async update(id: string, userData: any) {
    if (!this.users.has(id)) return null;
    const updatedUser = { ...this.users.get(id), ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string) {
    return this.users.delete(id);
  }
}
