// src/resume_skill/resume_skill.entity.ts
import { Resume } from 'src/resume/resume.entity';
import { Skill } from 'src/skill/skill.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('resume_skill')
export class ResumeSkill {
  @PrimaryColumn('uuid')
  resumeId: string;

  @PrimaryColumn('int')
  skillId: number;

  @ManyToOne(() => Resume, (resume) => resume.resumeSkills)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @ManyToOne(() => Skill, (skill) => skill.resumeSkills)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
