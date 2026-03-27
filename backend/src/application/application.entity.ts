// src/application/application.entity.ts
import { Candidate } from 'src/candidate/candidate.entity';
import { JobPost } from 'src/jobPost/jobPost.entity';
import { Resume } from 'src/resume/resume.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('application')
export class Application {
  @PrimaryColumn('uuid')
  candidateId: string;

  @PrimaryColumn('uuid')
  jobId: string;

  @Column('uuid')
  resumeId: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.applications)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.applications)
  @JoinColumn({ name: 'jobId' })
  jobPost: JobPost;

  @ManyToOne(() => Resume, (resume) => resume.applications)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @Column('date')
  date: Date;

  @Column('varchar')
  status: string;
}
