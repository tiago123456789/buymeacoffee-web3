import { Injectable } from '@nestjs/common';
import { EncrypterInterface } from './encrypter.interface';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class BcryptAdapter implements EncrypterInterface {
  getHash(value: string): Promise<string> {
    return hash(value, 8);
  }

  isValid(textPlain: string, hash: string): Promise<boolean> {
    return compare(textPlain, hash);
  }
}
