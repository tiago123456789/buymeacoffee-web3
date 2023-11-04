import { Injectable } from '@nestjs/common';
import { ParamsPayload, TokeInterface } from './token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAdapter implements TokeInterface {
  constructor(private jwtService: JwtService) {}

  get(params: ParamsPayload): Promise<string> {
    return this.jwtService.signAsync(params);
  }

  async isValid(token: string): Promise<boolean | ParamsPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return {
        id: payload.id,
        email: payload.email,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
