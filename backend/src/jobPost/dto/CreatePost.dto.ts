// src/jobPost/dto/CreatePost.dto
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Senior Backend Developer',
    description: 'Tiêu đề công việc',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'We are looking for a talented backend developer...',
    description: 'Mô tả công việc',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: 15000000,
    description: 'Mức lương tối thiểu',
  })
  @IsNumber()
  @IsOptional()
  salaryMin: number;

  @ApiPropertyOptional({ example: 25000000, description: 'Mức lương tối đa' })
  @IsNumber()
  @IsOptional()
  salaryMax: number;

  @ApiProperty({
    example: 'Remote',
    description: 'Hình thức làm việc: On-site, Hybrid, Remote',
    enum: ['On-site', 'Hybrid', 'Remote'],
  })
  @IsString()
  @IsNotEmpty()
  jobType: string;

  @ApiProperty({
    example: 'Senior',
    description: 'Cấp bậc: Intern, Fresher, Junior, Middle, Senior',
    enum: ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior'],
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ example: 'Backend', description: 'Vai trò công việc' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    example: 'Full-time',
    description: 'Phạm vi công việc',
  })
  @IsString()
  @IsNotEmpty()
  jobScope: string;

  @ApiPropertyOptional({
    example: '2026-06-30',
    description: 'Hạn nộp hồ sơ',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deadline: Date;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID của ngành nghề / category',
  })
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiPropertyOptional({
    example: [1, 5, 8],
    description: 'Danh sách ID của các kỹ năng',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  skillIds: number[];
}
