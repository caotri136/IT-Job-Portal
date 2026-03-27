// src/resume/resume.module
import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './resume.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ResumeSkillModule } from 'src/resume_skill/resume_skill.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    CloudinaryModule,
    ResumeSkillModule,
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
