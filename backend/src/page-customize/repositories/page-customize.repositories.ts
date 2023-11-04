import { Injectable } from '@nestjs/common';
import { PageCustomizeRepositoryInterface } from './page-customize-repository-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageCustomize } from '../page-customize.entity';

@Injectable()
export class PageCustomizeRepositories
  implements PageCustomizeRepositoryInterface<PageCustomize>
{
  constructor(
    @InjectRepository(PageCustomize)
    private readonly repository: Repository<PageCustomize>,
  ) {}

  findByUserId(userId: string): Promise<PageCustomize> {
    return this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async save(newData: PageCustomize): Promise<void> {
    await this.repository.save(newData);
  }
}
