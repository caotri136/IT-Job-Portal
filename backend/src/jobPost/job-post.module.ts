// src/jobPost/job-post.module
import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './jobPost.entity';
import { JobSkillModule } from 'src/job_skill/job_skill.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost]), JobSkillModule],
  controllers: [JobPostController],
  providers: [JobPostService],
  exports: [JobPostService],
})
export class JobPostModule {}
