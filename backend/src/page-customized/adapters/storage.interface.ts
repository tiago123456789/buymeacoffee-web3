export interface ParamsUpload {
  path: string;
  content: Buffer;
}

export interface StorageInterface {
  upload(params: ParamsUpload): Promise<string>;
}
