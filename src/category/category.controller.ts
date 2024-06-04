import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guard/token.guard';
import { CategoryService } from './category.service';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    try {
      return this.categoryService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':categoryName')
  findOne(@Param('categoryName') categoryName: string) {
    try {
      return this.categoryService.findByName(categoryName);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() category: Category) {
    try {
      return this.categoryService.create(category);
    } catch (error) {
      throw error;
    }
  }
}
