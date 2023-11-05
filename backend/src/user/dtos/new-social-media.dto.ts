import { IsNotEmpty, IsUrl } from 'class-validator';

export class NewSocialMediaDto {
  @IsNotEmpty()
  @IsUrl()
  link: string;
  userId: string;
}
