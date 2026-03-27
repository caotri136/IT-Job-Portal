// dto/FilterPost.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPostDto {
  @ApiPropertyOptional({ example: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Số lượng record mỗi trang',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Senior', description: 'Cấp bậc' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ example: 'Backend', description: 'Vai trò công việc' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: 'Remote', description: 'Hình thức làm việc' })
  @IsOptional()
  @IsString()
  jobScope?: string;

  @ApiPropertyOptional({ example: 'Full-time', description: 'Loại công việc' })
  @IsOptional()
  @IsString()
  jobType?: string;

  @ApiPropertyOptional({ example: 3, description: 'ID ngành nghề' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    example: 10000000,
    description: 'Mức lương tối thiểu',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional({ example: 30000000, description: 'Mức lương tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMax?: number;
}
