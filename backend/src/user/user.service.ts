import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { NewRegisterDto } from './dtos/new-register.dto';
import {
  ENCRYPTER_PROVIDER,
  SOCIAL_MEDIA_REPOSITORY,
  TOKEN_PROVIDER,
  USER_REPOSITORY,
} from '../common/configs/provider.config';
import { EncrypterInterface } from './adapters/encrypter.interface';
import { CredentialDto } from './dtos/credential.dto';
import { UserRepositoryInterface } from './repositories/user-repository.interface';
import { SocialMedia } from './entities/social-media.entity';
import { NewSocialMediaDto } from './dtos/new-social-media.dto';
import { SocialMediaRepositoryInterface } from './repositories/social-media-repository.interface';
import { TokeInterface } from '../common/adapters/token.interface';
import {
  INVALID_CREDENTIALS,
  EMAIL_ALREADY_USED,
  NAME_ALREADY_USED,
  USER_NOT_FOUND,
} from '../common/errors/message.error';

@Injectable()
export class UserService {
  constructor(
    @Inject(SOCIAL_MEDIA_REPOSITORY)
    private readonly socialMediaRepository: SocialMediaRepositoryInterface<SocialMedia>,
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepositoryInterface<User>,
    @Inject(ENCRYPTER_PROVIDER)
    private readonly encrypterAdapter: EncrypterInterface,
    @Inject(TOKEN_PROVIDER)
    private readonly tokenAdapter: TokeInterface,
  ) {}

  async authenticate(credential: CredentialDto) {
    const userWithEmail = await this.repository.findByEmail(credential.email);
    if (!userWithEmail) {
      throw new HttpException(INVALID_CREDENTIALS, 401);
    }

    const isValid = await this.encrypterAdapter.isValid(
      credential.password,
      userWithEmail.password,
    );

    if (!isValid) {
      throw new HttpException(INVALID_CREDENTIALS, 401);
    }

    return this.tokenAdapter.get({
      id: userWithEmail.id,
      email: userWithEmail.email,
    });
  }

  async register(data: NewRegisterDto) {
    const [userWithEmail, userWithName] = await Promise.all([
      this.repository.findByEmail(data.email),
      this.repository.findByName(data.name),
    ]);

    if (userWithEmail) {
      throw new HttpException(EMAIL_ALREADY_USED, 409);
    }

    if (userWithName) {
      throw new HttpException(NAME_ALREADY_USED, 409);
    }

    const user = new User();
    user.email = data.email;
    user.name = data.name;
    user.slug = data.name.replace(/\s/g, '').toLowerCase();

    user.password = await this.encrypterAdapter.getHash(data.password);
    user.walletAddress = data.walletAddress;

    await this.repository.save(user);
    return user;
  }

  getMetricsByUserId(userId: string) {
    return this.repository.getMetricsByUserId(userId);
  }

  async addSocialMediaLink(newSocialMedia: NewSocialMediaDto) {
    const user = await this.repository.findById(newSocialMedia.userId);
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, 404);
    }

    const socialMedia = new SocialMedia();
    socialMedia.link = newSocialMedia.link;
    socialMedia.user = user;
    return this.socialMediaRepository.save(socialMedia);
  }
}
