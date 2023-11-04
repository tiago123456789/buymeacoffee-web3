import { Inject, Injectable } from '@nestjs/common';
import { DonationRepositoryInterface } from './repositories/donation-repository.interface';
import { Donation } from './donations.entity';
import { NewDonationDto } from './dtos/new-donation.dto';
import {
  DONATION_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/configs/provider.config';
import { Users } from 'src/users/entities/users.entity';
import { UserRepositoryInterface } from 'src/users/repositories/user-repository.interface';
import { ReturndonationPaginateDto } from './dtos/return-donation-paginate.dto';

@Injectable()
export class DonationsService {
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly repository: DonationRepositoryInterface<Donation>,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface<Users>,
  ) {}

  findPaginateByReceiverId(
    page: number,
    itemsPerPage: number,
    receiverId: string,
  ): Promise<ReturndonationPaginateDto> {
    return this.repository.findPaginateByReceiverId(
      page,
      itemsPerPage,
      receiverId,
    );
  }

  async save(newData: NewDonationDto) {
    const donation = new Donation();
    donation.message = newData.message;
    donation.donatorAddress = newData.donatorAddress;

    const user = await this.userRepository.findById(newData.receiverId);
    donation.receiver = user;
    donation.value = newData.value;

    await this.repository.save(donation);
  }
}
