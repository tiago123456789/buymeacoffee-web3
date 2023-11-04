import { Inject, Injectable } from '@nestjs/common';
import {
  PAGE_CUSTOMIZE_REPOSITORY,
  STORAGE,
  USER_REPOSITORY,
} from 'src/common/configs/provider.config';
import { StorageInterface } from './adapters/storage.interface';
import { PageCustomizeDto } from './page-customize.dto';
import { randomUUID } from 'crypto';
import { PageCustomize } from './page-customize.entity';
import { UserRepositoryInterface } from 'src/users/repositories/user-repository.interface';
import { Users } from 'src/users/entities/users.entity';
import { PageCustomizeRepositoryInterface } from './repositories/page-customize-repository-interface';

@Injectable()
export class PageCustomizeService {
  constructor(
    @Inject(STORAGE) private storage: StorageInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface<Users>,
    @Inject(PAGE_CUSTOMIZE_REPOSITORY)
    private readonly repository: PageCustomizeRepositoryInterface<PageCustomize>,
  ) {}

  async findByUserId(userId) {
    return this.repository.findByUserId(userId);
  }

  async save(newPage: PageCustomizeDto, file: Buffer): Promise<void> {
    const imageBackground = await this.storage.upload({
      path: `${randomUUID()}${new Date().getTime()}.json`,
      content: file,
    });

    const page = new PageCustomize();
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
