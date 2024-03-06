import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersDbService } from './usersDb.service';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersDbService,
    private jwtService: JwtService,
  ) {}
  async signup(user: User) {
    const findUser = await this.usersService.findByEmail(user.email);
    if (findUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPasword = await bcrypt.hash(user.password, 10);
    if (!hashedPasword) {
      throw new BadRequestException('Password could not be hashed');
    }
    return await this.usersService.create({
      ...user,
      password: hashedPasword,
    });
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = this.jwtService.sign(userPayload);

    return {
      message: 'User logged in successfully!',
      token,
    };
  }
}
