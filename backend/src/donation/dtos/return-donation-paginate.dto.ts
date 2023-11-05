import { Donation } from '../donation.entity';

export class ReturndonationPaginateDto {
  data: Donation[];
  total: number;
}
