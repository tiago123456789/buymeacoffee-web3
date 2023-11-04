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
import { PageCustomizeDto } from './page-customize.dto';
import { HasAuthenticatedGuard } from 'src/security/has-authenticated.guard';
import { RequestWithUserId } from 'src/common/types/request-with-user-id';
import { PageCustomizeService } from './page-customize.service';
import { PageCustomize } from './page-customize.entity';

@Controller('/users')
export class PageCustomizeController {
  constructor(private pageCustomizeService: PageCustomizeService) {}

  @Get('/:id/page-customizations')
  @UseGuards(HasAuthenticatedGuard)
  async getPageCustomize(@Param('id') id: string): Promise<PageCustomize> {
    return await this.pageCustomizeService.findByUserId(id);
  }

  @Post('/page-customizations')
  @HttpCode(201)
  @UseGuards(HasAuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file'))
  async savePageCustomize(
    @UploadedFile() file: Express.Multer.File,
    @Body() pageCustomizeDto: PageCustomizeDto,
    @Req() request: RequestWithUserId,
  ): Promise<void> {
    pageCustomizeDto.userId = request.userId;
    await this.pageCustomizeService.save(pageCustomizeDto, file.buffer);
  }
}
