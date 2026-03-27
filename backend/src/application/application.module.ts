// src/application/application.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application } from './application.entity';
import { JobPost } from 'src/jobPost/jobPost.entity';
import { JobPostModule } from 'src/jobPost/job-post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Application, JobPost]), JobPostModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
