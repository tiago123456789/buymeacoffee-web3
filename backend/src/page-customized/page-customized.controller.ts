import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageCustomizedDto } from './page-customized.dto';
import { HasAuthenticatedGuard } from 'src/security/has-authenticated.guard';
import { RequestWithUserId } from 'src/common/types/request-with-user-id';
import { PageCustomizedService } from './page-customized.service';
import { PageCustomized } from './page-customized.entity';

@Controller('/users')
export class PageCustomizedController {
  constructor(private pageCustomizeService: PageCustomizedService) {}

  @Get('/:id/pages-customized')
  @UseGuards(HasAuthenticatedGuard)
  async getPageCustomized(@Param('id') id: string): Promise<PageCustomized> {
    return await this.pageCustomizeService.findByUserId(id);
  }

  @Post('/pages-customized')
  @HttpCode(201)
  @UseGuards(HasAuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file'))
  async savePageCustomized(
    @UploadedFile() file: Express.Multer.File,
    @Body() pageCustomizeDto: PageCustomizedDto,
    @Req() request: RequestWithUserId,
  ): Promise<void> {
    pageCustomizeDto.userId = request.userId;
    await this.pageCustomizeService.save(pageCustomizeDto, file.buffer);
  }
}
