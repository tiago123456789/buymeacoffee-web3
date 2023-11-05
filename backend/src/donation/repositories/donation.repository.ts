import { Injectable } from '@nestjs/common';
import { DonationRepositoryInterface } from './donation-repository.interface';
import { Donation } from '../donation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturndonationPaginateDto } from '../dtos/return-donation-paginate.dto';

@Injectable()
export class DonationRepository
  implements DonationRepositoryInterface<Donation>
{
  constructor(
    @InjectRepository(Donation)
    private readonly repository: Repository<Donation>,
  ) {}

  async findPaginateByReceiverId(
    page: number,
    itemsPerPage: number,
    receiverId: string,
  ): Promise<ReturndonationPaginateDto> {
    const [result, total] = await this.repository.findAndCount({
      where: {
        receiver: {
          id: receiverId,
        },
      },
      take: itemsPerPage,
      skip: page,
      order: {
        createdAt: 'desc',
      },
    });

    return {
      data: result,
      total,
    };
  }

  async save(newData: Donation): Promise<void> {
    await this.repository.save(newData);
  }
}
