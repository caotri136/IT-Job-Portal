// src/auth/auth.controller
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Put,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { ApiOperation, ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
  @ApiBody({ type: LoginUserDto })
  signIn(@Body() data: LoginUserDto): Promise<{ access_token: string }> {
    return this.authService.signIn(data);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: CreateUserDto })
  register(@Body() data: CreateUserDto): Promise<{ message: string }> {
    return this.authService.register(data);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Xác thực OTP khi đăng ký' })
  @ApiBody({ type: VerifyUserDto })
  verify(@Body() data: VerifyUserDto): Promise<{ message: string }> {
    return this.authService.verify(data.email, data.otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất tài khoản' })
  logout(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin profile' })
  @ApiBody({ type: UpdateUserDto })
  updateProfile(@Request() req, @Body() data: UpdateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.updateProfile(req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin profile hiện tại' })
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.getProfile(req.user.sub);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Quên mật khẩu - Gửi OTP về email' })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Xác thực OTP khi quên mật khẩu' })
  @ApiBody({ type: VerifyUserDto })
  verifyForgot(@Body() data: VerifyUserDto) {
    return this.authService.forgotVerify(data);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu mới' })
  resetPassword(
    @Headers('authorization') authHeader: string,
    @Body('newPassword') newpass: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    return this.authService.resetPassword(token, newpass);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refresh(body.userId, body.refreshToken);
  }
}
