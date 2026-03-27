// src/job_skill/job_skill.module
import { Module } from '@nestjs/common';
import { JobSkillController } from './job_skill.controller';
import { JobSkillService } from './job_skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSkill } from './job_skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSkill])],
  controllers: [JobSkillController],
  providers: [JobSkillService],
  exports: [JobSkillService],
})
export class JobSkillModule {}
