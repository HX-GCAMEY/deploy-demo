import { Inject, Injectable } from '@nestjs/common';
import { User } from '../controllers/users.controller';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject('API_USERS') private apiUsers: any[],
    private usersRepository: UsersRepository,
  ) {}

  async getUsers() {
    const DBusers = await this.usersRepository.getUsers();
    const users = [...this.apiUsers, ...DBusers];
    return users;
  }

  async getUser(id: string) {
    return this.usersRepository.getUser(id);
  }

  async getByName(name: string) {
    return this.usersRepository.getByName(name);
  }

  async createUser(user: User) {
    return this.usersRepository.createUser(user);
  }
}
