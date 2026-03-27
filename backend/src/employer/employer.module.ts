// src/employer/employer.module
import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employer } from './employer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employer])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
