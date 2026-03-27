import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from 'src/user/user.entity';
import { Candidate } from 'src/candidate/candidate.entity';
import { Employer } from 'src/employer/employer.entity';
import { Company } from 'src/company/company.entity';
import { JobPost } from 'src/jobPost/jobPost.entity';
import { JobSkill } from 'src/job_skill/job_skill.entity';
import { Resume } from 'src/resume/resume.entity';
import { ResumeSkill } from 'src/resume_skill/resume_skill.entity';
import { Skill } from 'src/skill/skill.entity';
import { JobCategory } from 'src/job_category/job_category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Candidate,
      Employer,
      Company,
      JobPost,
      JobSkill,
      Resume,
      ResumeSkill,
      Skill,
      JobCategory,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
