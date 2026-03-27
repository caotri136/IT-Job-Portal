// src/company/company.module
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Employer } from 'src/employer/employer.entity';
import { EmployerModule } from 'src/employer/employer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Employer]), EmployerModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
