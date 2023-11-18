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
import { USER_CANT_HAVE_MANY_PAGES } from 'src/common/errors/message.error';
import { UserService } from 'src/user/user.service';
import { randomUUID } from 'crypto';
import datasource from '../typeorm.config';
import { PageCustomizedService } from 'src/page-customized/page-customized.service';

describe('PageCustomizedController (e2e)', () => {
  let app: INestApplication;
  const dataSource = datasource;
  const fakeData = { email: 'test@gmail.com', password: '123456' };
  const fakePageCustomized = {
    name: 'Fake test',
    enableTotalSupporters: true,
    themeColor: 'black',
    whatAreYouDoing: 'Fake test',
    featuredVideo: 'http://youtube.com.br/myvideo',
    description: 'Fake description',
  };
  const fakeFile = Buffer.from('asdljflaksdnflsdlfk');

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

  function getAccessToken() {
    const userService = app.get(UserService);
    return userService.authenticate(fakeData);
  }

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

  it('/users/:id/pages-customized (POST) return status code 401', async () => {
    await dropAll();
    const userCreated = await createUser();
    const response = await request(app.getHttpServer())
      .get(`/users/${userCreated.id}/pages-customized`)
      .send(fakeData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/users/:id/pages-customized (POST) return status code 200', async () => {
    await dropAll();
    const userCreated = await createUser();
    const pageCustomizedService = app.get(PageCustomizedService);
    await pageCustomizedService.save(
      {
        ...fakePageCustomized,
        userId: userCreated.id,
      },
      fakeFile,
    );
    const accessToken = await getAccessToken();
    const response = await request(app.getHttpServer())
      .get(`/users/${userCreated.id}/pages-customized`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.featuredVideo).toBe(fakePageCustomized.featuredVideo);
    expect(response.body.description).toBe(fakePageCustomized.description);
    expect(response.body.whatAreYouDoing).toBe(
      fakePageCustomized.whatAreYouDoing,
    );
    expect(response.body).toHaveProperty('imageBackground');
  });

  it('/users/:id/pages-customized (POST) return status code 200', async () => {
    await dropAll();
    const userCreated = await createUser();
    const accessToken = await getAccessToken();
    const response = await request(app.getHttpServer())
      .get(`/users/${userCreated.id}/pages-customized`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(Object.keys(response.body).length).toBe(0);
  });

  it('/users/:id/pages-customized (POST) return status code 200', async () => {
    await dropAll();
    const userCreated = await createUser();
    const pageCustomizedService = app.get(PageCustomizedService);
    await pageCustomizedService.save(
      {
        ...fakePageCustomized,
        userId: userCreated.id,
      },
      fakeFile,
    );
    const accessToken = await getAccessToken();
    const response = await request(app.getHttpServer())
      .get(`/users/${userCreated.id}/pages-customized`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.featuredVideo).toBe(fakePageCustomized.featuredVideo);
    expect(response.body.description).toBe(fakePageCustomized.description);
    expect(response.body.whatAreYouDoing).toBe(
      fakePageCustomized.whatAreYouDoing,
    );
    expect(response.body).toHaveProperty('imageBackground');
  });

  it('/users/pages-customized (POST) return status code 401', async () => {
    const response = await request(app.getHttpServer())
      .post(`/users/pages-customized`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/users/pages-customized (POST) return status code 403', async () => {
    const response = await request(app.getHttpServer())
      .post(`/users/pages-customized`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer afafsdfafçfifms`);

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden resource');
  });

  it('/users/pages-customized (POST) return status code 409', async () => {
    await dropAll();
    const userCreated = await createUser();
    const pageCustomizedService = app.get(PageCustomizedService);
    await pageCustomizedService.save(
      {
        ...fakePageCustomized,
        userId: userCreated.id,
      },
      fakeFile,
    );
    const accessToken = await getAccessToken();

    const response = await request(app.getHttpServer())
      .post(`/users/pages-customized`)
      .attach('file', Buffer.from('asdljflaksdnflsdlfk'), 'test.txt')
      .field('description', fakePageCustomized.description)
      .field('enableTotalSupporters', fakePageCustomized.enableTotalSupporters)
      .field('featuredVideo', fakePageCustomized.featuredVideo)
      .field('name', fakePageCustomized.name)
      .field('themeColor', fakePageCustomized.themeColor)
      .field('whatAreYouDoing', fakePageCustomized.whatAreYouDoing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe(USER_CANT_HAVE_MANY_PAGES);
  });

  it('/users/pages-customized (POST) return status code 201', async () => {
    await dropAll();
    await createUser();
    const accessToken = await getAccessToken();

    const response = await request(app.getHttpServer())
      .post(`/users/pages-customized`)
      .attach('file', Buffer.from('asdljflaksdnflsdlfk'), 'test.txt')
      .field('description', fakePageCustomized.description)
      .field('enableTotalSupporters', fakePageCustomized.enableTotalSupporters)
      .field('featuredVideo', fakePageCustomized.featuredVideo)
      .field('name', fakePageCustomized.name)
      .field('themeColor', fakePageCustomized.themeColor)
      .field('whatAreYouDoing', fakePageCustomized.whatAreYouDoing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(201);
  });
});
