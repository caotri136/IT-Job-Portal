// src/resume_skill/resume_skill.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeSkill } from './resume_skill.entity';
import { ResumeSkillService } from './resume_skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeSkill])],
  providers: [ResumeSkillService],
  exports: [ResumeSkillService],
})
export class ResumeSkillModule {}
