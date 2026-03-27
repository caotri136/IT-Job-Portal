// src/user/user.entity.ts
import { Candidate } from 'src/candidate/candidate.entity';
import { Employer } from 'src/employer/employer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  birthDay: Date;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expired_at: Date | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  verified: boolean;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  // User 1-1 Candidate
  @OneToOne(() => Candidate, (candidate) => candidate.user)
  candidate: Candidate;

  // User 1-1 Employer
  @OneToOne(() => Employer, (employer) => employer.user)
  employer: Employer;
}
