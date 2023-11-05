import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ENCRYPTER_PROVIDER,
  SOCIAL_MEDIA_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/configs/provider.config';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { SocialMedia } from './entities/social-media.entity';
import { SocialMediaRepository } from './repositories/social-media.repository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, SocialMedia]), CommonModule],
  providers: [
    UserService,
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
  controllers: [UserController],
})
export class UserModule {}
