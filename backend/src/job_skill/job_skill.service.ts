// src/job_skill/job_skill/service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobSkill } from './job_skill.entity';
import { Repository } from 'typeorm';
import { CreateJobSkillDto } from './dto/createJobSkill.dto';

@Injectable()
export class JobSkillService {
  constructor(
    @InjectRepository(JobSkill)
    private readonly jobSkillRepository: Repository<JobSkill>,
  ) {}

  public async createJobSkill(data: CreateJobSkillDto): Promise<JobSkill> {
    const jobSkill = this.jobSkillRepository.create(data);
    await this.jobSkillRepository.save(jobSkill);
    return jobSkill;
  }

  public async saveJobSkill(
    data: { jobId: string; skillId: number }[],
  ): Promise<any> {
    await this.jobSkillRepository.save(data);
  }

  public async deleteByJobId(jobId: string): Promise<void> {
    await this.jobSkillRepository.delete({ jobId });
  }

  public async findByJobId(jobId: string): Promise<JobSkill[]> {
    return await this.jobSkillRepository.find({
      where: { jobId },
      relations: ['skill'],
    });
  }
}
