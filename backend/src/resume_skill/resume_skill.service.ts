// src/resume_skill/resume_skill.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumeSkill } from './resume_skill.entity';

@Injectable()
export class ResumeSkillService {
  constructor(
    @InjectRepository(ResumeSkill)
    private readonly resumeSkillRepo: Repository<ResumeSkill>,
  ) {}

  public async saveResumeSkills(
    data: { resumeId: string; skillId: number }[],
  ): Promise<void> {
    await this.resumeSkillRepo.save(data);
  }

  public async deleteByResumeId(resumeId: string): Promise<void> {
    await this.resumeSkillRepo.delete({ resumeId });
  }

  public async findByResumeId(resumeId: string): Promise<ResumeSkill[]> {
    return await this.resumeSkillRepo.find({
      where: { resumeId },
      relations: ['skill'],
    });
  }
}
