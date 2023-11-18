import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  PAGE_CUSTOMIZE_REPOSITORY,
  STORAGE,
  USER_REPOSITORY,
} from '../common/configs/provider.config';
import { StorageInterface } from './adapters/storage.interface';
import { PageCustomizedDto } from './page-customized.dto';
import { randomUUID } from 'crypto';
import { PageCustomized } from './page-customized.entity';
import { UserRepositoryInterface } from '../user/repositories/user-repository.interface';
import { User } from '../user/entities/user.entity';
import { PageCustomizedRepositoryInterface } from './repositories/page-customized-repository-interface';
import { USER_CANT_HAVE_MANY_PAGES } from '../common/errors/message.error';

@Injectable()
export class PageCustomizedService {
  constructor(
    @Inject(STORAGE) private storage: StorageInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface<User>,
    @Inject(PAGE_CUSTOMIZE_REPOSITORY)
    private readonly repository: PageCustomizedRepositoryInterface<PageCustomized>,
  ) {}

  async findByUserId(userId) {
    return this.repository.findByUserId(userId);
  }

  async save(newPage: PageCustomizedDto, file: Buffer): Promise<void> {
    const pageCustomizedOfUser = await this.repository.findByUserId(
      newPage.userId,
    );
    if (pageCustomizedOfUser) {
      throw new HttpException(USER_CANT_HAVE_MANY_PAGES, 409);
    }

    const [imageBackground, user] = await Promise.all([
      this.storage.upload({
        path: `${randomUUID()}${new Date().getTime()}.png`,
        content: file,
      }),
      this.userRepository.findById(newPage.userId),
    ]);

    const page = new PageCustomized();
    page.description = newPage.description;
    page.enableTotalSupporters = newPage.enableTotalSupporters;
    page.featuredVideo = newPage.featuredVideo;
    page.imageBackground = imageBackground;
    page.themeColor = newPage.themeColor;
    page.user = user;

    page.whatAreYouDoing = newPage.whatAreYouDoing;
    await this.repository.save(page);
  }
}
