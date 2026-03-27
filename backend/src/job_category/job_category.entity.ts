// src/job_category/job_category.entity.ts
import { JobPost } from 'src/jobPost/jobPost.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job_category')
export class JobCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  // Nhiều category con thuộc về 1 category cha
  @ManyToOne(() => JobCategory, (category) => category.childCategories, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parentCategory: JobCategory;

  // 1 category cha có nhiều category con
  @OneToMany(() => JobCategory, (category) => category.parentCategory)
  childCategories: JobCategory[];

  @OneToMany(() => JobPost, (jobPost) => jobPost.category)
  jobPosts: JobPost[];
}
