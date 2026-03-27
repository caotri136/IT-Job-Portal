// src/company/dto/UpdateCompany.dto
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    example: 'Công ty TNHH ABC Solutions',
    description: 'Tên công ty',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: '456 Đường XYZ, Quận 7, TP.HCM',
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
