import { Donation } from '../donations.entity';

export class ReturndonationPaginateDto {
  data: Donation[];
  total: number;
}
