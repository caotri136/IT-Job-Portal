// src/user/dto/createUser.dto
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên người dùng' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email đăng ký' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '2000-05-15',
    description: 'Ngày sinh',
  })
  @Type(() => Date)
  @IsDate()
  birthDay: Date;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mật khẩu tài khoản',
  })
  @IsNotEmpty()
  password: string;
}
