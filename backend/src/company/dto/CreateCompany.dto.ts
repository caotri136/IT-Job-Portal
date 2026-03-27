// src/company/dto/CreateCompany.dto
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Công ty TNHH ABC',
    description: 'Tên công ty',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ công ty',
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    example: 'Công ty chuyên về lĩnh vực công nghệ thông tin...',
    description: 'Mô tả về công ty',
  })
  @IsString()
  @IsOptional()
  description: string;
}
