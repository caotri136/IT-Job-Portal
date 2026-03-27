// src/user/dto/updateUser.dto
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: '2000-05-15',
    description: 'Ngày sinh',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDay: Date;
}
