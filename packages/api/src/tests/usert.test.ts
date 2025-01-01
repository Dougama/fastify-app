import {IUserRepository} from '../repositories/interfaces.js';
// import { hashPassword } from '@app/utils/basic_auth/hash_pass.js';
import { UserService } from '../services/users.js';

const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as jest.Mocked<IUserRepository>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(mockRepository);
  });

  describe('getAllUsers', () => {
    it('debe retornar todos los usuarios sin contraseñas', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'Usuario 1',
          email: 'user1@test.com',
          password: 'hash1',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Usuario 2',
          email: 'user2@test.com',
          password: 'hash2',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual([
        {id: '1', name: 'Usuario 1', email: 'user1@test.com'},
        {id: '2', name: 'Usuario 2', email: 'user2@test.com'},
      ]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('debe retornar un usuario sin contraseña cuando existe', async () => {
      const mockUser = {
        id: '1',
        name: 'Usuario 1',
        email: 'user1@test.com',
        password: 'hash1',
      };

      mockRepository.findById.mockResolvedValue(mockUser as any);

      const result = await userService.getUserById('1');

      expect(result).toEqual({
        id: '1',
        name: 'Usuario 1',
        email: 'user1@test.com',
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('debe retornar null cuando el usuario no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById('999');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });
  });

  // describe('createUser', () => {
  //   it('debe crear un usuario y retornarlo sin contraseña', async () => {
  //     const userData = {
  //       name: 'Nuevo Usuario',
  //       email: 'nuevo@test.com',
  //       password: 'password123',
  //     };

  //     const hashedPassword = hashPassword(userData.password);
  //     const createdUser = {
  //       id: '1',
  //       ...userData,
  //       password: hashedPassword,
  //     };

  //     mockRepository.create.mockResolvedValue(createdUser as any);

  //     const result = await userService.createUser(userData);

  //     expect(result).toEqual({
  //       id: '1',
  //       name: 'Nuevo Usuario',
  //       email: 'nuevo@test.com',
  //     });
  //     expect(mockRepository.create).toHaveBeenCalledWith({
  //       ...userData,
  //       password: expect.any(String),
  //     });
  //   });
  // });

  describe('updateUser', () => {
    it('debe actualizar un usuario correctamente', async () => {
      const updateData = {
        name: 'Nombre Actualizado',
        email: 'actualizado@test.com',
      };

      mockRepository.update.mockResolvedValue({
        id: '1',
        ...updateData,
        password: null,
        role: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userService.updateUser('1', updateData);

      expect(result).toEqual({
        id: '1',
        ...updateData,
      });
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar un usuario correctamente', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await userService.deleteUser('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
