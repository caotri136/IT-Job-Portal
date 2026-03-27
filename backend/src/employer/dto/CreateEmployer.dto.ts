// src/employer/dto/CreateEmployer.dto
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateEmployerDto {
  @ApiPropertyOptional({
    example: 'HR Manager',
    description: 'Chức vụ của employer',
  })
  @IsString()
  @IsOptional()
  position: string;

  @ApiPropertyOptional({
    example: '0123456789',
    description: 'Số điện thoại liên hệ',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    example: '67c9d8e2f1a2b3c4d5e6f7a8',
    description: 'ID của công ty muốn tham gia',
  })
  @IsUUID()
  @IsOptional()
  companyId: string;
}
