import { InjectRepository } from '@nestjs/typeorm';
import { SocialMedia } from '../entities/social-media.entity';
import { SocialMediaRepositoryInterface } from './social-media-repository.interface';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialMediaRepository
  implements SocialMediaRepositoryInterface<SocialMedia>
{
  constructor(
    @InjectRepository(SocialMedia)
    private readonly repository: Repository<SocialMedia>,
  ) {}

  async save(newData: SocialMedia): Promise<void> {
    await this.repository.save(newData);
  }
}
