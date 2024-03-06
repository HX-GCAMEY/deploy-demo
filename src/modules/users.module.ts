import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../middlewares/logger';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { UsersRepository } from '../repositories/users.repository';
import { UsersDbService } from '../services/usersDb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CloudinaryConfig } from '../config/cloudinary';
import { CloudinaryService } from '../services/cloudinary.service';
import { AuthService } from '../services/auth.service';
import { requiresAuth } from 'express-openid-connect';

// const usersMockService = {
//   getUsers: () => {
//     return 'Este es el proveedor de servicios de mock.';
//   },
// };

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersService,
    AuthService,
    CloudinaryConfig,
    CloudinaryService,
    UsersDbService,
    {
      provide: 'API_USERS',
      useFactory: async () => {
        const apiUsers = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        ).then((response) => response.json());
        const cleanUsers = apiUsers.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });

        return cleanUsers;
      },
    },
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
    consumer.apply(requiresAuth()).forRoutes('users/auth0/protected');
  }
}
