import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(category: Category) {
    const isExisted = await this.categoryModel.findOne({
      name: category.name,
    });

    if (isExisted) {
      throw new ConflictException('이미 존재하는 카테고리 입니다.');
    }

    return await new this.categoryModel(category).save();
  }

  async deleteCategory(categoryName: string) {
    const isExisted = await this.categoryModel.findOne({
      name: categoryName,
    });

    if (!isExisted) {
      throw new NotFoundException('존재하지 않는 카테고리 입니다.');
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({});
  }

  async findByName(categoryName: string): Promise<Category> {
    const result = await this.categoryModel.findOne({ name: categoryName });

    if (!result) {
      throw new NotFoundException('존재하지 않는 카테고리 입니다.');
    }

    return result;
  }

  async addPost(categoryName: string, postNumber: number) {
    return this.categoryModel.updateOne(
      { name: categoryName },
      {
        $push: {
          posts: postNumber,
        },
      },
    );
  }

  async removePost(categoryName: string, postNumber: number) {
    return this.categoryModel.updateOne(
      { name: categoryName },
      {
        $pull: {
          posts: postNumber,
        },
      },
    );
  }
}
