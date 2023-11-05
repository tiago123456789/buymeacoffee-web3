import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
