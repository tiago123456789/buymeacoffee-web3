import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { DONATION_REPOSITORY } from 'src/common/configs/provider.config';
import { DonationRepository } from './repositories/donation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './donations.entity';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), UsersModule, CommonModule],
  providers: [
    {
      provide: DONATION_REPOSITORY,
      useClass: DonationRepository,
    },
    DonationsService,
  ],
  controllers: [DonationsController],
})
export class DonationsModule {}
