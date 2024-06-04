import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';

import { PostService } from './post.service';
import { Post as CPost } from './schemas/post.schema';
import { JwtAuthGuard } from 'src/auth/guard/token.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Query('categoryName') categoryName?: string): Promise<CPost[]> {
    if (categoryName) {
      try {
        return this.postService.findByCategoryName(categoryName);
      } catch (error) {
        throw error;
      }
    }

    try {
      return this.postService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('withoutContent')
  findAllWithoutContent(): Promise<CPost[]> {
    return this.postService.findAllWithoutContent();
  }

  @Get('nextPostNumber')
  findNextPostNumber(): Promise<number> {
    return this.postService.findNextPostNumber();
  }

  @Get(':postNumber')
  findOne(@Param('postNumber') postNumber: number): Promise<CPost> {
    try {
      return this.postService.findByPostNumber(postNumber);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() post: CPost): Promise<CPost> {
    try {
      return this.postService.create(post);
    } catch (error) {
      throw error;
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updatePost(@Body() post: CPost) {
    try {
      return this.postService.updatePost(post);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':postNumber')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('postNumber') postNumber: number) {
    try {
      return this.postService.deletePost(postNumber);
    } catch (error) {
      throw error;
    }
  }
}
