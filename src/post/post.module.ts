import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Post, PostSchema } from './schemas/post.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
