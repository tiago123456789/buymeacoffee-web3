import { Module } from '@nestjs/common';
import { PageCustomizeService } from './page-customize.service';
import { PageCustomizeController } from './page-customize.controller';
import {
  PAGE_CUSTOMIZE_REPOSITORY,
  STORAGE,
} from 'src/common/configs/provider.config';
import { S3Adapter } from './adapters/s3.adapter';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { PageCustomizeRepositories } from './repositories/page-customize.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageCustomize } from './page-customize.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageCustomize]),
    CommonModule,
    UsersModule,
  ],
  providers: [
    PageCustomizeService,
    {
      provide: STORAGE,
      useClass: S3Adapter,
    },
    {
      provide: PAGE_CUSTOMIZE_REPOSITORY,
      useClass: PageCustomizeRepositories,
    },
  ],
  controllers: [PageCustomizeController],
})
export class PageCustomizeModule {}
