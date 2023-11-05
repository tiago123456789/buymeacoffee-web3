import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ParamsUpload, StorageInterface } from './storage.interface';

@Injectable()
export class S3Adapter implements StorageInterface {
  private client: S3;

  constructor() {
    this.client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS,
      },
    });
  }

  async upload(params: ParamsUpload): Promise<string> {
    const response = await this.client
      .upload({
        Bucket: process.env.BUCKET,
        Key: params.path,
        Body: params.content,
      })
      .promise();

    return response.Location;
  }
}
