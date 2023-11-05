import { ReturndonationPaginateDto } from '../dtos/return-donation-paginate.dto';

export interface DonationRepositoryInterface<T> {
  findPaginateByReceiverId(
    page: number,
    itemsPerPage: number,
    receiverId: string,
  ): Promise<ReturndonationPaginateDto>;
  save(newData: T): Promise<void>;
}
