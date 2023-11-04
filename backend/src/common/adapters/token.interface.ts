export interface ParamsPayload {
  id: string;
  email: string;
}

export interface TokeInterface {
  get(params: ParamsPayload): Promise<string>;

  isValid(token: string): Promise<boolean | ParamsPayload>;
}
