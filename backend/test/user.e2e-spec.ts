import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SecurityModule } from 'src/security/security.module';
import { DonationModule } from 'src/donation/donation.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { PageCustomizedModule } from 'src/page-customized/page-customized.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EMAIL_ALREADY_USED,
  INVALID_CREDENTIALS,
  NAME_ALREADY_USED,
} from 'src/common/errors/message.error';
import { UserService } from 'src/user/user.service';
import { randomUUID } from 'crypto';
import datasource from '../typeorm.config';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const dataSource = datasource;
  const fakeData = { email: 'test@gmail.com', password: '123456' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.testing' }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory(config: ConfigService) {
            return {
              type: 'cockroachdb',
              url: config.get('DB_URL'),
              entities: [__dirname + '/../**/*.entity.ts'],
              synchronize: true,
              ssl: true,
              poolSize: 100,
            };
          },
        }),
        JwtModule.registerAsync({
          global: true,
          inject: [ConfigService],
          useFactory(config: ConfigService) {
            return {
              global: true,
              secret: config.get('JWT_SECRET'),
              signOptions: { expiresIn: '1d' },
            };
          },
        }),
        UserModule,
        CommonModule,
        PageCustomizedModule,
        SecurityModule,
        DonationModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  function createUser() {
    const userService = app.get(UserService);
    return userService.register({
      email: fakeData.email,
      password: fakeData.password,
      name: 'Test',
      walletAddress: randomUUID(),
    });
  }
  async function dropAllUsers() {
    await dataSource.initialize();
    await dataSource.query(`TRUNCATE users CASCADE;`);
    await dataSource.destroy();
  }

  it('/users/auth (POST) return status code 401', async () => {
    await dropAllUsers();
    const response = await request(app.getHttpServer())
      .post('/users/auth')
      .send(fakeData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(INVALID_CREDENTIALS);
  });

  // it('/users/auth (POST) return status code 401', async () => {
  //   await dropAllUsers();
  //   await createUser();
  //   const response = await request(app.getHttpServer())
  //     .post('/users/auth')
  //     .send({
  //       email: fakeData.email,
  //       password: '123456789',
  //     })
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(401);
  //   expect(response.body.message).toBe(INVALID_CREDENTIALS);
  // });

  // it('/users/auth (POST) return status code 201', async () => {
  //   await dropAllUsers();
  //   await createUser();
  //   const response = await request(app.getHttpServer())
  //     .post('/users/auth')
  //     .send(fakeData)
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(201);
  //   expect(response.body).toHaveProperty('accessToken');
  // });

  // it('/users (POST) return status code 409', async () => {
  //   await dropAllUsers();
  //   await createUser();
  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send(fakeData)
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(409);
  //   expect(response.body.message).toBe(EMAIL_ALREADY_USED);
  // });

  // it('/users (POST) return status code 409', async () => {
  //   await dropAllUsers();
  //   await createUser();

  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send({
  //       email: 'faketest@gmail.com',
  //       password: fakeData.password,
  //       name: 'Test',
  //       walletAddress: randomUUID(),
  //     })
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(409);
  //   expect(response.body.message).toBe(NAME_ALREADY_USED);
  // });

  // it('/users (POST) return status code 201', async () => {
  //   await dropAllUsers();
  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send({
  //       email: 'faketest@gmail.com',
  //       password: fakeData.password,
  //       name: 'Test',
  //       walletAddress: randomUUID(),
  //     })
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(201);
  // });

  // it('/users/social-medias (POST) return status code 401', async () => {
  //   await dropAllUsers();
  //   await createUser();

  //   const response = await request(app.getHttpServer())
  //     .post('/users/social-medias')
  //     .send({
  //       link: 'www.testexample.com.br',
  //     })
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(401);
  //   expect(response.body.message).toBe('Unauthorized');
  // });

  // it('/users/social-medias (POST) return status code 403', async () => {
  //   await dropAllUsers();
  //   await createUser();

  //   const response = await request(app.getHttpServer())
  //     .post('/users/social-medias')
  //     .send({
  //       link: 'www.testexample.com.br',
  //     })
  //     .set('Authorization', 'Bearer alsfjsdfjsrfwewoiqrofo')
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(403);
  //   expect(response.body.message).toBe('Forbidden resource');
  // });

  // it('/users/social-medias (POST) return status code 201', async () => {
  //   await dropAllUsers();
  //   const userService = app.get(UserService);
  //   await createUser();
  //   const accessToken = await userService.authenticate(fakeData);
  //   const response = await request(app.getHttpServer())
  //     .post('/users/social-medias')
  //     .send({
  //       link: 'www.testexample.com.br',
  //     })
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(201);
  // });

  // it('/users/social-medias (POST) return status code 404', async () => {
  //   await dropAllUsers();
  //   const userService = app.get(UserService);
  //   await createUser();
  //   const accessToken = await userService.authenticate(fakeData);
  //   await dropAllUsers();
  //   const response = await request(app.getHttpServer())
  //     .post('/users/social-medias')
  //     .send({
  //       link: 'www.testexample.com.br',
  //     })
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .set('Accept', 'application/json');

  //   expect(response.statusCode).toBe(404);
  // });
});
