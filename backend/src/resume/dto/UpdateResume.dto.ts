// src/resume/dto/UpdateResume.dto
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateResumeDto {
  @ApiProperty({ example: 'Frontend Intern' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'Fresher',
    enum: ['Intern', 'Fresher', 'Junior', 'Senior', 'Manager'],
  })
  @IsString()
  @IsOptional()
  level: string;

  @ApiProperty({ example: 'Backend' })
  @IsString()
  @IsOptional()
  role: string;

  @ApiPropertyOptional({ example: 'HCMUS' })
  @IsString()
  @IsOptional()
  education: string;

  @ApiPropertyOptional({ example: 'Data Science' })
  @IsString()
  @IsOptional()
  major: string;

  @ApiPropertyOptional({
    example: 'Hybrid',
    enum: ['On site', 'Remote', 'Hybrid'],
  })
  @IsString()
  @IsOptional()
  jobScope: string;

  @ApiPropertyOptional({ example: [1, 3, 5], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  skillIds: number[];
}
