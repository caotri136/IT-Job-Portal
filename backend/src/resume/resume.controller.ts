// src/resume/resume.controller
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateResumeDto } from './dto/CreateResume.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResumeDto } from './dto/UpdateResume.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cv'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo resume mới, upload cv dạng PDF' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cv: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        level: { type: 'string' },
        role: { type: 'string' },
        jobScope: { type: 'string' },
        education: { type: 'string' },
        major: { type: 'string' },
        skillIds: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  public async createResume(
    @Req() req,
    @Body() data: CreateResumeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.resumeService.createResume(req.user.sub, data, file);
  }

  @Get('my-resumes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả resume của candidate' })
  public async getMyResumes(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.resumeService.getAll(req.user.sub);
  }

  @ApiOperation({ summary: 'Lấy thông tin resume theo ID' })
  @ApiParam({ name: 'resume-id', type: String })
  @Get(':resume-id')
  public async getResume(@Param('resume-id') resumeId: string) {
    return await this.resumeService.getResume(resumeId);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin của Resume' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'resume-id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cv: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        level: { type: 'string' },
        role: { type: 'string' },
        jobScope: { type: 'string' },
        education: { type: 'string' },
        major: { type: 'string' },
        skillIds: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  @Put(':resume-id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cv'))
  public async updateResume(
    @Param('resume-id') resumeId: string,
    @Req() req,
    @Body() data: UpdateResumeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.resumeService.updateResume(
      resumeId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.sub,
      data,
      file,
    );
  }

  @ApiOperation({ summary: 'Xóa Resume dựa trên resume-id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'resume-id', type: String })
  @Delete(':resume-id')
  @UseGuards(JwtAuthGuard)
  public async deleteResume(@Param('resume-id') resumeId: string, @Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.resumeService.deleteResume(resumeId, req.user.sub);
  }
}
