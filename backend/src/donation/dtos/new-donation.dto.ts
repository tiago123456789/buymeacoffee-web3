import { IsNotEmpty, Min } from 'class-validator';

export class NewDonationDto {
  public receiverId: string;
  @IsNotEmpty()
  public donatorAddress: string;
  public message: string;
  @Min(0.001)
  public value: number;
}
