import { IsNotEmpty, IsUrl } from 'class-validator';

export class PageCustomizedDto {
  @IsNotEmpty()
  name: string;
  enableTotalSupporters: boolean;
  themeColor: string;

  @IsNotEmpty()
  whatAreYouDoing: string;

  @IsNotEmpty()
  @IsUrl()
  featuredVideo: string;

  @IsNotEmpty()
  description: string;
  userId: string;
}
