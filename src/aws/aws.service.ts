import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as sharp from 'sharp';

@Injectable()
export class AwsService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('MY_AWS_S3_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.get('MY_AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('MY_AWS_SECRET_KEY'),
      },
    });
  }

  async getImages(postNumber: number) {
    const command = new ListObjectsCommand({
      Bucket: this.configService.get('MY_AWS_S3_BUCKET'),
      Prefix: `posts/${postNumber}`,
    });

    const data = await this.s3Client.send(command);

    return data.Contents.filter((item) => item.Size !== 0).map(
      (item) => item.Key,
    );
  }

  async imageUploadToS3(fileName: string, fileBuffer: Buffer, ext: string) {
    const webpBuffer = await sharp(fileBuffer)
      .toFormat('webp')
      .webp({ quality: 80 })
      .toBuffer();

    const command = new PutObjectCommand({
      Bucket: this.configService.get('MY_AWS_S3_BUCKET'),
      Key: fileName,
      Body: webpBuffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(command);
  }
}
