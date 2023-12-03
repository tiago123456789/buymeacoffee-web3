import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NewRegisterDto } from './dtos/new-register.dto';
import { UserService } from './user.service';
import { CredentialDto } from './dtos/credential.dto';
import { HasAuthenticatedGuard } from '../security/has-authenticated.guard';
import { RequestWithUserId } from 'src/common/types/request-with-user-id';
import { NewSocialMediaDto } from './dtos/new-social-media.dto';
import { DashboardMetricDto } from './dtos/dashboard-metric.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/auth')
  async authenticate(
    @Body() credentials: CredentialDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ [key: string]: any }> {
    const accessToken = await this.userService.authenticate(credentials);
    response.cookie('accessToken', accessToken);
    return {
      accessToken,
    };
  }

  @Post()
  @HttpCode(201)
  async registers(@Body() newRegister: NewRegisterDto): Promise<void> {
    await this.userService.register(newRegister);
  }

  @UseGuards(HasAuthenticatedGuard)
  @Post('/social-medias')
  @HttpCode(201)
  async addSocialNetwork(
    @Req() request: RequestWithUserId,
    @Body() socialMedia: NewSocialMediaDto,
  ): Promise<void> {
    socialMedia.userId = request.userId;
    await this.userService.addSocialMediaLink(socialMedia);
  }

  @UseGuards(HasAuthenticatedGuard)
  @Get('/dashboard-metrics')
  @HttpCode(201)
  async getDashboardMetrics(
    @Req() request: RequestWithUserId,
  ): Promise<DashboardMetricDto> {
    const metrics = await this.userService.getMetricsByUserId(request.userId);
    return metrics;
  }
}
