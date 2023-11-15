import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PageCustomizedModule } from './page-customized/page-customized.module';
import { SecurityModule } from './security/security.module';
import { JwtModule } from '@nestjs/jwt';
import { DonationModule } from './donation/donation.module';

console.log('#######################');
console.log(process.env.NODE_ENV);
console.log('#######################');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.testing' }),
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
})
export class AppModule {}
