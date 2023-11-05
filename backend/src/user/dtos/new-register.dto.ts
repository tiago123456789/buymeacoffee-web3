import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewRegisterDto {
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public walletAddress: string;
}
