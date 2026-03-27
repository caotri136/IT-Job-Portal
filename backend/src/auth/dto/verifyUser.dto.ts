// /src/auth/dto/verifyUser.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã OTP 6 chữ số được gửi về email',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
