// src/employer/employer.controller
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateEmployerDto } from './dto/CreateEmployer.dto';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Employer')
@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('join/:compId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer tham gia vào công ty' })
  @ApiParam({ name: 'compId', type: String, description: 'ID của công ty' })
  public async joinCompany(@Request() req, @Param('compId') compId: string) {
    return await this.employerService.createEmployer(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.sub,
      compId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin profile Employer' })
  @ApiBody({ type: UpdateEmployerDto })
  public async updateProfile(@Request() req, @Body() data: UpdateEmployerDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.employerService.updateProfile(req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin profile Employer' })
  public async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.employerService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('quit-job')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer nghỉ việc / rời khỏi công ty' })
  public async quitJob(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.employerService.quitJob(req.user.sub);
  }
}
