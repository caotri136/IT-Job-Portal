// src/resume/dto/CreateResume.dto
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ example: 'Backend Intern CV' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Intern',
    enum: ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Manager'],
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ example: 'Backend' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({ example: 'HCMUT' })
  @IsString()
  @IsOptional()
  education: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  major: string;

  @ApiPropertyOptional({
    example: 'Remote',
    enum: ['On site', 'Remote', 'Hybrid'],
  })
  @IsString()
  @IsOptional()
  jobScope: string;

  @ApiPropertyOptional({ example: [1, 3, 7], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  skillIds?: number[];
}
