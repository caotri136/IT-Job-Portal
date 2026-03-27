// src/job_category/job_category.module
import { Module } from '@nestjs/common';
import { JobCategoryController } from './job_category.controller';
import { JobCategoryService } from './job_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from './job_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [JobCategoryController],
  providers: [JobCategoryService],
  exports: [JobCategoryService],
})
export class JobCategoryModule {}
