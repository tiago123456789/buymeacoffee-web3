import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { DonationService } from './donation.service';
import { NewDonationDto } from './dtos/new-donation.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ReturndonationPaginateDto } from './dtos/return-donation-paginate.dto';

@Controller('donations')
export class DonationController {
  constructor(private donationService: DonationService) {}

  @Get()
  findPaginate(
    @Query() query,
    @Query('receiverId') receiverId: string,
  ): Promise<ReturndonationPaginateDto> {
    const pagination = new PaginationDto(query.page, query.itemsPerPage);
    return this.donationService.findPaginateByReceiverId(
      pagination.getPage(),
      pagination.getItemsPerPage(),
      receiverId,
    );
  }

  @Post()
  @HttpCode(201)
  async save(@Body() newDonation: NewDonationDto): Promise<void> {
    await this.donationService.save(newDonation);
    return;
  }
}
