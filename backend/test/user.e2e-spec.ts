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

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory(config: ConfigService) {
            return {
              type: 'cockroachdb',
              url: config.get('DB_URL'),
              entities: [__dirname + '/../**/*.entity.js'],
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

  it('/users/auth (POST) ', async () => {
    await request(app.getHttpServer())
      .post('/users/auth')
      .send({ email: '', password: '' })
      .end((error, res) => {
        console.log(error, res.body);
      });
  });
});
