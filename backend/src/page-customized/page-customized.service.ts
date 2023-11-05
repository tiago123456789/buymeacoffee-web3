import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  PAGE_CUSTOMIZE_REPOSITORY,
  STORAGE,
  USER_REPOSITORY,
} from 'src/common/configs/provider.config';
import { StorageInterface } from './adapters/storage.interface';
import { PageCustomizedDto } from './page-customized.dto';
import { randomUUID } from 'crypto';
import { PageCustomized } from './page-customized.entity';
import { UserRepositoryInterface } from 'src/user/repositories/user-repository.interface';
import { User } from 'src/user/entities/user.entity';
import { PageCustomizedRepositoryInterface } from './repositories/page-customized-repository-interface';

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
    const imageBackground = await this.storage.upload({
      path: `${randomUUID()}${new Date().getTime()}.json`,
      content: file,
    });

    const pageCustomizedOfUser = this.repository.findByUserId(newPage.userId);
    if (pageCustomizedOfUser) {
      throw new HttpException('User can have only one page customized', 409);
    }

    const page = new PageCustomized();
    page.description = newPage.description;
    page.enableTotalSupporters = newPage.enableTotalSupporters;
    page.featuredVideo = newPage.featuredVideo;
    page.imageBackground = imageBackground;
    page.themeColor = newPage.themeColor;

    const user = await this.userRepository.findById(newPage.userId);
    page.user = user;

    page.whatAreYouDoing = newPage.whatAreYouDoing;
    await this.repository.save(page);
  }
}
