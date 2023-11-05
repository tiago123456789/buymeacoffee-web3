import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { DONATION_REPOSITORY } from 'src/common/configs/provider.config';
import { DonationRepository } from './repositories/donation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), UserModule, CommonModule],
  providers: [
    {
      provide: DONATION_REPOSITORY,
      useClass: DonationRepository,
    },
    DonationService,
  ],
  controllers: [DonationController],
})
export class DonationModule {}
