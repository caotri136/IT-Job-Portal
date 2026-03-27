// src/resume/resume.entity.ts
import { Application } from 'src/application/application.entity';
import { Candidate } from 'src/candidate/candidate.entity';
import { ResumeSkill } from 'src/resume_skill/resume_skill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('resume')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  candidateId: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.resumes)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @Column({
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column('varchar')
  level: string;

  @Column('varchar')
  role: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  jobScope: string;

  @Column({ type: 'varchar', nullable: true })
  education: string;

  @Column('varchar')
  cvUrl: string;

  @Column({ type: 'varchar', nullable: true })
  major: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.resume)
  applications: Application[];

  @OneToMany(() => ResumeSkill, (resumeSkill) => resumeSkill.resume)
  resumeSkills: ResumeSkill[];
}
