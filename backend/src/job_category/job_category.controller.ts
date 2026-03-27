// src/job_category/job_category.controller
import { Controller, Get, Param } from '@nestjs/common';
import { JobCategoryService } from './job_category.service';

@Controller('job-category')
export class JobCategoryController {
  constructor(private readonly categoryService: JobCategoryService) {}

  @Get()
  public async findRoots() {
    return await this.categoryService.findRoots();
  }

  @Get('all')
  public async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.categoryService.findById(+id);
  }
}
