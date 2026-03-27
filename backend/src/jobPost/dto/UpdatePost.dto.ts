// src/jobPost/dto/UpdatePost.dto
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Senior Backend Developer (Updated)' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ example: 'Updated job description...' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ example: 18000000 })
  @IsNumber()
  @IsOptional()
  salaryMin: number;

  @ApiPropertyOptional({ example: 28000000 })
  @IsNumber()
  @IsOptional()
  salaryMax: number;

  @ApiPropertyOptional({ example: 'Hybrid' })
  @IsString()
  @IsOptional()
  jobType: string;

  @ApiPropertyOptional({ example: 'Middle' })
  @IsString()
  @IsOptional()
  level: string;

  @ApiPropertyOptional({ example: 'Backend' })
  @IsString()
  @IsOptional()
  role: string;

  @ApiPropertyOptional({ example: 'Full-time' })
  @IsString()
  @IsOptional()
  jobScope: string;

  @ApiPropertyOptional({ example: '2026-07-15' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deadline: Date;

  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiPropertyOptional({ example: [2, 6, 9], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  skillIds: number[];
}
