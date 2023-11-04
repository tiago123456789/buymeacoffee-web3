export interface EncrypterInterface {
  getHash(value: string): Promise<string>;

  isValid(textPlain: string, hash: string): Promise<boolean>;
}
