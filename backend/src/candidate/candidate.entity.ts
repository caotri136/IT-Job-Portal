// src/application/candidate.entity.ts

import { Application } from 'src/application/application.entity';
import { Resume } from 'src/resume/resume.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('candidate')
export class Candidate {
  @PrimaryColumn('uuid')
  id: string;

  // Candidate 1-1 User (inheritance)
  @OneToOne(() => User, (user) => user.candidate, { onDelete: 'CASCADE' })
  // join column userID of both table
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => Resume, (resume) => resume.candidate)
  resumes: Resume[];

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];
}
