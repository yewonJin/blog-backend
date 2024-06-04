import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AwsService } from './aws.service';
import { JwtAuthGuard } from 'src/auth/guard/token.guard';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('/posts/:postNumber')
  async getImages(@Param('postNumber') postNumber: number) {
    try {
      return await this.awsService.getImages(postNumber);
    } catch (error) {
      throw new error();
    }
  }

  @Post('/posts/:postNumber')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFile(
    @Param('postNumber') postNumber: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        return await this.awsService.imageUploadToS3(
          `posts/${postNumber}/${file.originalname.split('.')[0]}.webp`,
          file.buffer,
          'webp',
        );
      }),
    );

    return {
      statusCode: 201,
      message: `이미지 등록 성공`,
    };
  }
}
