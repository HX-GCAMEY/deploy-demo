import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersDbService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email: email });
  }
}
