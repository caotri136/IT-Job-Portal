// src/job_skill/job_skill.controller
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { JobSkillService } from './job_skill.service';
import { CreateJobSkillDto } from './dto/createJobSkill.dto';
import { ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Job Skill')
@Controller('job-skill')
export class JobSkillController {
  constructor(private readonly jobSkillService: JobSkillService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm skill vào job post' })
  @ApiBody({ type: CreateJobSkillDto })
  public async createJobSkill(@Body() data: CreateJobSkillDto) {
    return await this.jobSkillService.createJobSkill(data);
  }

  @Delete(':jobId')
  @ApiOperation({ summary: 'Xóa tất cả skill của một job post' })
  @ApiParam({ name: 'jobId', type: String })
  public async deleteByJobId(@Param('jobId') jobId: string) {
    return await this.jobSkillService.deleteByJobId(jobId);
  }

  @Get(':jobId')
  @ApiOperation({ summary: 'Lấy danh sách skill của một job post' })
  @ApiParam({ name: 'jobId', type: String })
  public async findByJobId(@Param('jobId') jobId: string) {
    return await this.jobSkillService.findByJobId(jobId);
  }
}
