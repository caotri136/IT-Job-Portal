// src/application/company.entity.ts
import { Employer } from 'src/employer/employer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('company')
export class Company {
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
    length: 100,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Employer, (employer) => employer.company)
  employers: Employer[];

  @Column({ type: 'uuid', nullable: false })
  ownerId: string;
}
