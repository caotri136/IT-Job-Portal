// src/job_skill/job_skill.entity.ts
import { JobPost } from 'src/jobPost/jobPost.entity';
import { Skill } from 'src/skill/skill.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('job_skill')
export class JobSkill {
  @PrimaryColumn('uuid')
  jobId: string;

  @PrimaryColumn('int')
  skillId: number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.jobSkills)
  @JoinColumn({ name: 'jobId' })
  jobPost: JobPost;

  @ManyToOne(() => Skill, (skill) => skill.jobSkills)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
