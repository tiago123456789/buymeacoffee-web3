import { Module } from '@nestjs/common';
import { PageCustomizedService } from './page-customized.service';
import { PageCustomizedController } from './page-customized.controller';
import {
  PAGE_CUSTOMIZE_REPOSITORY,
  STORAGE,
} from '../common/configs/provider.config';
import { S3Adapter } from './adapters/s3.adapter';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { PageCustomizedRepository } from './repositories/page-customized.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageCustomized } from './page-customized.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageCustomized]),
    CommonModule,
    UserModule,
  ],
  providers: [
    PageCustomizedService,
    {
      provide: STORAGE,
      useClass: S3Adapter,
    },
    {
      provide: PAGE_CUSTOMIZE_REPOSITORY,
      useClass: PageCustomizedRepository,
    },
  ],
  controllers: [PageCustomizedController],
})
export class PageCustomizedModule {}
