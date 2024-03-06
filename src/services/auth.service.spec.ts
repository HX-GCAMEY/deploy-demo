import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersDbService } from './usersDb.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import * as jwt from 'jsonwebtoken';

// it('Create an instance of AuthService', async () => {
//   const mockUser: User = {
//     id: '123h2-23n4mn-23n4n-23n4n',
//     name: 'John Doe',
//     createdAt: '26/02/2024',
//     password: 'password123',
//     email: 'testuser@gmail.com',
//   };

//   const mockUsersService: Partial<UsersDbService> = {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     findByEmail: (email: string): Promise<User> =>
//       Promise.resolve({ ...mockUser, isAdmin: false }),

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     create: (user: User): Promise<User> =>
//       Promise.resolve({ ...mockUser, isAdmin: false }),
//   };

//   const module = await Test.createTestingModule({
//     providers: [
//       AuthService,
//       JwtService,
//       { provide: UsersDbService, useValue: mockUsersService },
//     ],
//   }).compile();

//   const authService = module.get<AuthService>(AuthService);
//   expect(authService).toBeDefined();
// });

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersDbService>;

  const mockUser: Partial<User> = {
    name: 'Bartolomiau',
    createdAt: '26/02/2024',
    password: 'password123',
    email: 'barto@gmail.com',
  };

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: () => Promise.resolve(undefined),

      create: (user: Partial<User>): Promise<User> =>
        Promise.resolve({
          ...user,
          isAdmin: false,
          id: '1234fs-234sd-24csdf-34sdfg',
        } as User),
    };

    const mockJwtService = {
      sign: (payload) => jwt.sign(payload, 'testSecret'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersDbService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Testing AuthModule is defined', () => {
    expect(authService).toBeDefined();
  });

  it('signup() creates a new user with an encripted Password', async () => {
    const user = await authService.signup(mockUser as User);

    expect(user).toBeDefined();
    expect(user.password).not.toEqual(mockUser.password);
  });

  it('signup() throws an error if the email is already in use', async () => {
    mockUsersService.findByEmail = () => Promise.resolve(mockUser as User);
    try {
      await authService.signup(mockUser as User);
    } catch (error) {
      expect(error.message).toEqual('Email already in use');
    }
  });

  it('signin() returns an error if the password is invalid', async () => {
    mockUsersService.findByEmail = () => Promise.resolve(mockUser as User);
    try {
      await authService.signin(
        mockUser.email as string,
        'invalidPassword' as string,
      );
    } catch (error) {
      expect(error.message).toEqual('Invalid password');
    }
  });

  it('signin() returns an error if the user is not found', async () => {
    try {
      await authService.signin(
        mockUser.email as string,
        mockUser.password as string,
      );
    } catch (error) {
      expect(error.message).toEqual('User not found');
    }
  });

  it('signin() returns an object with a message and a token if the user is found and the password is valid', async () => {
    const mockUserVariant = { ...mockUser };
    mockUserVariant.password = await bcrypt.hash(
      mockUser.password as string,
      10,
    );

    mockUsersService.findByEmail = () =>
      Promise.resolve(mockUserVariant as User);

    const response = await authService.signin(
      mockUser.email as string,
      mockUser.password as string,
    );

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.message).toEqual('User logged in successfully!');
  });
});
