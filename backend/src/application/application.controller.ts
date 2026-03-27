// src/application/application.controller
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobpost-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Candidate apply job' })
  @ApiParam({ name: 'jobpost-id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resumeId: {
          type: 'string',
          example: '67c9d8e2f1a2b3c4d5e6f7a8',
        },
      },
    },
  })
  public async createApplication(
    @Req() req,
    @Param('jobpost-id') jobPostId: string,
    @Body() body: { resumeId: string },
  ) {
    return this.applicationService.createApplication(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.sub,
      jobPostId,
      body.resumeId,
    );
  }

  @Delete(':jobpost-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Candidate hủy apply' })
  @ApiParam({ name: 'jobpost-id', type: String })
  public async deleteApplication(
    @Req() req,
    @Param('jobpost-id') jobPostId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.applicationService.deleteApplication(req.user.sub, jobPostId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Candidate xem tất cả job đã apply' })
  public async getAllApplicationByCandidate(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.applicationService.getAllApplicationByCandidate(req.user.sub);
  }

  @Get('jobpost/:jobpost-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer xem tất cả application của job post' })
  @ApiParam({ name: 'jobpost-id', type: String })
  public async getAllApplicationByJobPost(
    @Req() req,
    @Param('jobpost-id') jobPostId: string,
  ) {
    return this.applicationService.getAllApplicationByJobPost(
      jobPostId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.sub,
    );
  }

  @Get(':jobpost-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết 1 application' })
  @ApiParam({ name: 'jobpost-id', type: String })
  public async getApplication(
    @Req() req,
    @Param('jobpost-id') jobPostId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.applicationService.getApplication(req.user.sub, jobPostId);
  }

  @Put('reject/:jobpost-id/:candidate-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer reject application' })
  @ApiParam({ name: 'jobpost-id', type: String })
  @ApiParam({ name: 'candidate-id', type: String })
  public async rejectApplication(
    @Req() req,
    @Param('jobpost-id') jobPostId: string,
    @Param('candidate-id') candidateId: string,
  ) {
    return this.applicationService.rejectApplication(
      candidateId,
      jobPostId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.sub,
    );
  }

  @Put('accept/:jobpost-id/:candidate-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer accept application' })
  @ApiParam({ name: 'jobpost-id', type: String })
  @ApiParam({ name: 'candidate-id', type: String })
  public async acceptApplication(
    @Req() req,
    @Param('jobpost-id') jobPostId: string,
    @Param('candidate-id') candidateId: string,
  ) {
    return this.applicationService.acceptApplication(
      candidateId,
      jobPostId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.sub,
    );
  }
}
