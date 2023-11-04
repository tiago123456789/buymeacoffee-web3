import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewRegisterDto } from './dtos/new-register.dto';
import { UsersService } from './users.service';
import { CredentialDto } from './dtos/credential.dto';
import { HasAuthenticatedGuard } from '../security/has-authenticated.guard';
import { RequestWithUserId } from 'src/common/types/request-with-user-id';
import { NewSocialMediaDto } from './dtos/new-social-media.dto';
import { DashboardMetricDto } from './dtos/dashboard-metric.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth')
  async authenticate(
    @Body() credentials: CredentialDto,
  ): Promise<{ [key: string]: any }> {
    const accessToken = await this.usersService.authenticate(credentials);
    return {
      accessToken,
    };
  }

  @Post()
  @HttpCode(201)
  async registers(@Body() newRegister: NewRegisterDto): Promise<void> {
    await this.usersService.register(newRegister);
  }

  @UseGuards(HasAuthenticatedGuard)
  @Post('/social-medias')
  @HttpCode(201)
  async addSocialNetwork(
    @Req() request: RequestWithUserId,
    @Body() socialMedia: NewSocialMediaDto,
  ): Promise<void> {
    socialMedia.userId = request.userId;
    await this.usersService.addSocialMediaLink(socialMedia);
  }

  @UseGuards(HasAuthenticatedGuard)
  @Get('/dashboard-metrics')
  @HttpCode(201)
  async getDashboardMetrics(
    @Req() request: RequestWithUserId,
  ): Promise<DashboardMetricDto> {
    const metrics = await this.usersService.getMetricsByUserId(request.userId);
    return metrics;
  }
}
