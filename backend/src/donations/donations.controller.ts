import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { NewDonationDto } from './dtos/new-donation.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ReturndonationPaginateDto } from './dtos/return-donation-paginate.dto';

@Controller('donations')
export class DonationsController {
  constructor(private donationService: DonationsService) {}

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
