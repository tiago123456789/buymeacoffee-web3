import { Module, Scope } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ENCRYPTER_PROVIDER,
  SOCIAL_MEDIA_REPOSITORY,
  TOKEN_PROVIDER,
  USER_REPOSITORY,
} from 'src/common/configs/provider.config';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './repositories/user.repository';
import { SocialMedia } from './entities/social-media.entity';
import { SocialMediaRepository } from './repositories/social-media.repository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, SocialMedia]), CommonModule],
  providers: [
    UsersService,
    {
      provide: ENCRYPTER_PROVIDER,
      useClass: BcryptAdapter,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: SOCIAL_MEDIA_REPOSITORY,
      useClass: SocialMediaRepository,
    },
  ],
  exports: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
