import { Injectable } from '@nestjs/common';
import { PageCustomizedRepositoryInterface } from './page-customized-repository-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageCustomized } from '../page-customized.entity';

@Injectable()
export class PageCustomizedRepository
  implements PageCustomizedRepositoryInterface<PageCustomized>
{
  constructor(
    @InjectRepository(PageCustomized)
    private readonly repository: Repository<PageCustomized>,
  ) {}

  findByUserId(userId: string): Promise<PageCustomized> {
    return this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async save(newData: PageCustomized): Promise<void> {
    await this.repository.insert(newData);
  }
}
