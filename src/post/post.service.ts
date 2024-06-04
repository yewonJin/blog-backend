import {
  BadRequestException,
  ConflictException,
  Injectable,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post, PostDocument } from './schemas/post.schema';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private categoryModel: CategoryService,
  ) {}

  async create(post: Post): Promise<Post> {
    const isExisted = await this.postModel.findOne({
      postNumber: post.postNumber,
    });

    if (isExisted) {
      throw new ConflictException('이미 존재하는 postNumber입니다.');
    }

    // 카테고리의 포스트 리스트에 추가
    await this.categoryModel.addPost(post.category, post.postNumber);

    return await new this.postModel(post).save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find();
  }

  async findAllWithoutContent(): Promise<Post[]> {
    return this.postModel.aggregate([
      {
        $project: {
          content: 0,
        },
      },
      {
        $sort: { postNumber: -1 },
      },
    ]);
  }

  async findByPostNumber(postNumber: number): Promise<Post> {
    const post = await this.postModel.findOne({ postNumber });

    if (!post) {
      throw new BadRequestException('postNumber를 다시 입력해주세요');
    }

    return post;
  }

  async findNextPostNumber(): Promise<number> {
    const post = (await this.postModel.aggregate([
      {
        $project: {
          postNumber: 1,
        },
      },
      {
        $sort: { postNumber: -1 },
      },
      {
        $limit: 1,
      },
    ])) as Post[];

    return post[0].postNumber + 1;
  }

  async findByCategoryName(category: string): Promise<Post[]> {
    const posts = await this.postModel.find({ category });

    if (!posts.length) {
      throw new BadRequestException('카테고리 이름을 다시 입력해주세요');
    }

    return posts;
  }

  async updatePost(post: Post) {
    const isExisted = await this.postModel.findOne({
      postNumber: post.postNumber,
    });

    if (!isExisted) {
      throw new NotFoundException('존재하지 않는 게시물 입니다');
    }

    return await this.postModel.updateOne(
      { postNumber: post.postNumber },
      { $set: post },
    );
  }

  async deletePost(postNumber: number) {
    const isExisted = await this.postModel.findOne({
      postNumber,
    });

    if (!isExisted) {
      throw new NotFoundException('존재하지 않는 게시물 입니다');
    }

    // 카테고리의 포스트 리스트에서 제거
    // TODO: 적용 안되는 버그 해결해야함
    await this.categoryModel.removePost(isExisted.category, postNumber);

    return this.postModel.deleteOne({ postNumber });
  }
}
