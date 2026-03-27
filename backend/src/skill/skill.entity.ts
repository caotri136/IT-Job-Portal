// src/skill/skill.entity.ts
import { JobSkill } from 'src/job_skill/job_skill.entity';
import { ResumeSkill } from 'src/resume_skill/resume_skill.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SkillCategory } from './skillCategory.enum';

@Entity('skill')
export class Skill {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  name: string;

  @Column({ type: 'enum', enum: SkillCategory, nullable: false })
  category: SkillCategory;

  @OneToMany(() => ResumeSkill, (resumeSkill) => resumeSkill.skill)
  resumeSkills: ResumeSkill[];

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.skill)
  jobSkills: JobSkill[];
}
