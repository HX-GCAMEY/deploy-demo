import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setUncaughtExceptionCaptureCallback } from 'process';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get /users/ Returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users/');

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Get /users/:id Returns a user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/d3a33410-9219-43b4-8f94-daeec35c4ce5',
    );
    // const req = await request(app.getHttpServer()).get('/users/not-a-uuid');

    console.log(req.body);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('Get /users/:id throws a NotFoundException if the user doesnt exist with the message Usuario no encontrado', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/d3a33410-9219-43b4-8f94-daeec35c4ce1',
    );
    expect(req.status).toBe(404);
    expect(req.body.message).toBe('Usuario no encontrado');
  });

  it('Post /users/signup Creates a user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'malamita@gmail.com',
      password: '123456',
      name: 'Mita',
    });

    console.log(req.body);

    expect(req.status).toBe(201);
    expect(req.body).toBeInstanceOf(Object);
  });
});
