import { HttpException, Inject, Injectable } from '@nestjs/common';
import { DonationRepositoryInterface } from './repositories/donation-repository.interface';
import { Donation } from './donation.entity';
import { NewDonationDto } from './dtos/new-donation.dto';
import {
  DONATION_REPOSITORY,
  USER_REPOSITORY,
} from '../common/configs/provider.config';
import { User } from '../user/entities/user.entity';
import { UserRepositoryInterface } from '../user/repositories/user-repository.interface';
import { ReturndonationPaginateDto } from './dtos/return-donation-paginate.dto';
import { USER_NOT_FOUND } from '../common/errors/message.error';

@Injectable()
export class DonationService {
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly repository: DonationRepositoryInterface<Donation>,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface<User>,
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
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, 404);
    }
    donation.receiver = user;
    donation.value = newData.value;

    await this.repository.save(donation);
  }
}
