// src/application/application/service
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { In, Repository } from 'typeorm';
import { JobPost } from 'src/jobPost/jobPost.entity';
import { JobPostService } from 'src/jobPost/job-post.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(JobPost)
    private readonly jobPostRepo: Repository<JobPost>,
    private readonly jobPostService: JobPostService,
  ) {}

  public async createApplication(
    candidateId: string,
    jobPostId: string,
    resumeId: string,
  ): Promise<Application> {
    const existing = await this.applicationRepo.findOne({
      where: { candidateId: candidateId, jobId: jobPostId },
    });
    if (existing) throw new BadRequestException('You already applied this job');

    const application = this.applicationRepo.create({
      candidateId: candidateId,
      jobId: jobPostId,
      resumeId: resumeId,
      date: new Date(),
      status: 'Pending',
    });

    await this.applicationRepo.save(application);

    return application;
  }

  public async deleteApplication(
    candidateId: string,
    jobPostId: string,
  ): Promise<void> {
    const application = await this.applicationRepo.findOne({
      where: { candidateId: candidateId, jobId: jobPostId },
    });

    if (application === null) throw new NotFoundException();

    await this.applicationRepo.delete({
      candidateId: application.candidateId,
      jobId: application.jobId,
    });
  }

  public async getApplication(
    candidateId: string,
    jobPostId: string,
  ): Promise<Application> {
    const application = await this.applicationRepo.findOne({
      where: { candidateId: candidateId, jobId: jobPostId },
    });

    if (application === null) throw new NotFoundException();

    return application;
  }

  public async getAllApplicationByCandidate(
    candidateId: string,
  ): Promise<JobPost[]> {
    const applications = await this.applicationRepo.find({
      where: { candidateId: candidateId },
    });

    if (applications.length === 0) return [];

    const jobIds = applications.map((app) => app.jobId);

    return await this.jobPostRepo.find({
      where: { id: In(jobIds) },
      relations: ['employer', 'category'],
    });
  }

  public async getAllApplicationByJobPost(
    jobPostId: string,
    employerId: string,
  ): Promise<Application[]> {
    const jobPost = await this.jobPostRepo.findOne({
      where: { id: jobPostId },
    });
    if (!jobPost) throw new NotFoundException();
    if (jobPost.employerId !== employerId)
      throw new BadRequestException('You are not the owner of this job post');

    const applications = await this.applicationRepo.find({
      where: { jobId: jobPostId },
      relations: ['candidate', 'resume'],
    });

    return applications;
  }

  public async rejectApplication(
    candidateId: string,
    jobId: string,
    employerId: string,
  ): Promise<void> {
    const jobPost = await this.jobPostService.findById(jobId);
    if (jobPost === null) throw new NotFoundException();
    if (jobPost.employerId !== employerId)
      throw new BadRequestException('You are not the owner of this job post');

    const application = await this.getApplication(candidateId, jobId);
    if (!application) throw new NotFoundException();
    application.status = 'Rejected';
    await this.applicationRepo.save(application);
  }

  public async acceptApplication(
    candidateId: string,
    jobId: string,
    employerId: string,
  ): Promise<void> {
    const jobPost = await this.jobPostService.findById(jobId);
    if (jobPost === null) throw new NotFoundException();
    if (jobPost.employerId !== employerId)
      throw new BadRequestException('You are not the owner of this job post');

    const application = await this.getApplication(candidateId, jobId);
    if (!application) throw new NotFoundException();
    application.status = 'Accepted';
    await this.applicationRepo.save(application);
  }
}
