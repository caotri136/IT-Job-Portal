// src/jobPost/jobPost.entity.ts
import { Application } from 'src/application/application.entity';
import { Employer } from 'src/employer/employer.entity';
import { JobCategory } from 'src/job_category/job_category.entity';
import { JobSkill } from 'src/job_skill/job_skill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('jobPost')
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  salaryMin: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  salaryMax: number;

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  jobType: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  level: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  role: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  jobScope: string;

  @Index()
  @Column({
    type: 'date',
    nullable: true,
  })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @Column({ type: 'int', nullable: true })
  categoryId: number | null;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  employerId: string;

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employerId' })
  employer: Employer;

  @ManyToOne(() => JobCategory, (category) => category.jobPosts)
  @JoinColumn({ name: 'categoryId' })
  category: JobCategory;

  @OneToMany(() => Application, (application) => application.jobPost)
  applications: Application[];

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.jobPost, {
    onDelete: 'CASCADE',
  })
  jobSkills: JobSkill[];
}
