// src/application/employer.entity.ts
import { Company } from 'src/company/company.entity';
import { JobPost } from 'src/jobPost/jobPost.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('employer')
export class Employer {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  position: string;

  @Column({
    type: 'char',
    length: 10,
    nullable: true,
  })
  phone: string;

  @OneToOne(() => User, (user) => user.employer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @ManyToOne(() => Company, (company) => company.employers)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => JobPost, (JobPost) => JobPost.employer)
  jobPosts: JobPost[];
}
