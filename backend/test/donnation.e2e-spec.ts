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
  USER_CANT_HAVE_MANY_PAGES,
  USER_NOT_FOUND,
} from 'src/common/errors/message.error';
import { UserService } from 'src/user/user.service';
import { randomUUID } from 'crypto';
import datasource from '../typeorm.config';
import { PageCustomizedService } from 'src/page-customized/page-customized.service';
import { DonationService } from 'src/donation/donation.service';

describe('DonnationController (e2e)', () => {
  let app: INestApplication;
  const dataSource = datasource;
  const fakeData = { email: 'test@gmail.com', password: '123456' };
  const fakeDonation = {
    receiverId: null,
    donatorAddress: randomUUID(),
    message: '',
    value: 0.001,
  };

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

  async function dropAll() {
    await dataSource.initialize();
    await dataSource.query(`TRUNCATE users CASCADE;`);
    await dataSource.destroy();
  }

  it('/donations (POST) return status code 404', async () => {
    await dropAll();
    const response = await request(app.getHttpServer())
      .post('/donations')
      .send({})
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(USER_NOT_FOUND);
  });

  it('/donations (POST) return status code 201', async () => {
    await dropAll();
    const userCreated = await createUser();
    const response = await request(app.getHttpServer())
      .post('/donations')
      .send({
        ...fakeDonation,
        receiverId: userCreated.id,
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
  });

  it('/donations (POST) return status code 200', async () => {
    await dropAll();
    const response = await request(app.getHttpServer())
      .get('/donations')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.total).toBe(0);
  });

  it('/donations (POST) return status code 200', async () => {
    await dropAll();
    const userCreated = await createUser();
    const donationService = app.get(DonationService);
    await donationService.save({
      ...fakeDonation,
      receiverId: userCreated.id,
    });
    const response = await request(app.getHttpServer())
      .get('/donations')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.total).toBe(1);
  });
});
