import { Injectable } from '@nestjs/common';
import { User } from '../controllers/users.controller';

@Injectable()
export class UsersRepository {
  private users = [
    {
      id: 1,
      name: 'Bartolomaiu',
      email: 'barto@gmail.com',
    },
    {
      id: 2,
      name: 'Tota',
      email: 'tots@gmail.com',
    },
    {
      id: 3,
      name: 'Gama',
      email: 'gama@gmail.com',
    },
  ];

  async getUsers() {
    return this.users;
  }

  async getUser(id: string) {
    return this.users.find((user) => user.id === +id);
  }

  async getByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  async createUser(user: User) {
    const id = this.users.length + 1;

    this.users.push({ id, ...user });
    return user;
  }
}
