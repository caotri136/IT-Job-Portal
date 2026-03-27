// src/resume/resume.service
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './resume.entity';
import { Repository } from 'typeorm';
import { CreateResumeDto } from './dto/CreateResume.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateResumeDto } from './dto/UpdateResume.dto';
import { ResumeSkillService } from 'src/resume_skill/resume_skill.service';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume) private readonly resumeRepo: Repository<Resume>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly resumeSkillService: ResumeSkillService,
  ) {}

  public async createResume(
    userId: string,
    data: CreateResumeDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('CV file is required');

    if (file.mimetype !== 'application/pdf')
      throw new BadRequestException('Only PDF files are allowed');

    const cvUrl = await this.cloudinaryService.uploadPdf(file);

    const resume = this.resumeRepo.create({
      candidateId: userId,
      ...data,
      cvUrl,
    });
    await this.resumeRepo.save(resume);

    if (data.skillIds && data.skillIds.length > 0) {
      const resumeSkills = data.skillIds.map((skillId: number) => ({
        resumeId: resume.id,
        skillId,
      }));
      await this.resumeSkillService.saveResumeSkills(resumeSkills);
    }

    return resume;
  }

  public async getResume(resumeId: string): Promise<Resume> {
    const resume = await this.resumeRepo.findOne({
      where: { id: resumeId },
      relations: ['resumeSkills', 'resumeSkills.skill'],
    });
    if (!resume) throw new NotFoundException('Cannot find this resume');

    return resume;
  }

  public async getAll(candidateId: string): Promise<Resume[]> {
    return await this.resumeRepo.find({
      where: { candidateId: candidateId },
      relations: ['resumeSkills', 'resumeSkills.skill'],
    });
  }

  public async updateResume(
    resumeId: string,
    userId: string,
    data: UpdateResumeDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const resume = await this.resumeRepo.findOne({ where: { id: resumeId } });
    if (resume === null) throw new NotFoundException();
    if (resume.candidateId !== userId)
      throw new BadRequestException('You cannot modify this resume');

    resume.title = data.title;
    resume.level = data.level;
    resume.role = data.role;
    resume.education = data.education;
    resume.major = data.major;
    resume.jobScope = data.jobScope;

    if (file) {
      resume.cvUrl = await this.cloudinaryService.uploadPdf(file);
    }

    if (data.skillIds) {
      await this.resumeSkillService.deleteByResumeId(resumeId);
      if (data.skillIds.length > 0) {
        const resumeSkills = data.skillIds.map((skillId: number) => ({
          resumeId,
          skillId,
        }));
        await this.resumeSkillService.saveResumeSkills(resumeSkills);
      }
    }

    await this.resumeRepo.save(resume);
  }

  public async deleteResume(resumeId: string, userId: string): Promise<void> {
    const resume = await this.resumeRepo.findOne({ where: { id: resumeId } });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.candidateId !== userId)
      throw new BadRequestException('You cannot delete this resume');
    await this.resumeRepo.delete({ id: resumeId });
  }
}
