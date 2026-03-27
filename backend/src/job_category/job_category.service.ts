// src/job_category/job_category.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCategory } from './job_category.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class JobCategoryService {
  constructor(
    @InjectRepository(JobCategory)
    private readonly jobCategoryRepository: Repository<JobCategory>,
  ) {}

  // Chạy tự động khi app khởi động
  async onApplicationBootstrap() {
    await this.seedCategories();
  }

  private async seedCategories() {
    const count = await this.jobCategoryRepository.count();
    if (count > 0) return;

    // Seed roots
    const backend = await this.jobCategoryRepository.save({
      name: 'Backend',
      parentId: null,
    });
    const frontend = await this.jobCategoryRepository.save({
      name: 'Frontend',
      parentId: null,
    });
    const fullstack = await this.jobCategoryRepository.save({
      name: 'Fullstack',
      parentId: null,
    });
    const devops = await this.jobCategoryRepository.save({
      name: 'DevOps',
      parentId: null,
    });
    const mobile = await this.jobCategoryRepository.save({
      name: 'Mobile',
      parentId: null,
    });
    const aiml = await this.jobCategoryRepository.save({
      name: 'AI/ML',
      parentId: null,
    });
    const data = await this.jobCategoryRepository.save({
      name: 'Data',
      parentId: null,
    });
    const cybersecurity = await this.jobCategoryRepository.save({
      name: 'Cybersecurity',
      parentId: null,
    });
    const embedded = await this.jobCategoryRepository.save({
      name: 'Embedded',
      parentId: null,
    });
    const network = await this.jobCategoryRepository.save({
      name: 'Network',
      parentId: null,
    });
    const testing = await this.jobCategoryRepository.save({
      name: 'QA/Testing',
      parentId: null,
    });
    const uiux = await this.jobCategoryRepository.save({
      name: 'UI/UX',
      parentId: null,
    });
    const cloud = await this.jobCategoryRepository.save({
      name: 'Cloud',
      parentId: null,
    });

    // Backend sub
    await this.jobCategoryRepository.save({
      name: 'NestJS Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Spring Boot Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Django Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Laravel Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Go Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Ruby on Rails Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: '.NET Developer',
      parentId: backend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Node.js Developer',
      parentId: backend.id,
    });

    // Frontend sub
    await this.jobCategoryRepository.save({
      name: 'React Developer',
      parentId: frontend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Vue Developer',
      parentId: frontend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Angular Developer',
      parentId: frontend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'NextJS Developer',
      parentId: frontend.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Svelte Developer',
      parentId: frontend.id,
    });

    // Fullstack sub
    await this.jobCategoryRepository.save({
      name: 'MERN Stack Developer',
      parentId: fullstack.id,
    });
    await this.jobCategoryRepository.save({
      name: 'MEAN Stack Developer',
      parentId: fullstack.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Java Fullstack Developer',
      parentId: fullstack.id,
    });

    // DevOps sub
    await this.jobCategoryRepository.save({
      name: 'DevOps Engineer',
      parentId: devops.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Site Reliability Engineer',
      parentId: devops.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Platform Engineer',
      parentId: devops.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Infrastructure Engineer',
      parentId: devops.id,
    });

    // Mobile sub
    await this.jobCategoryRepository.save({
      name: 'Flutter Developer',
      parentId: mobile.id,
    });
    await this.jobCategoryRepository.save({
      name: 'React Native Developer',
      parentId: mobile.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Android Developer',
      parentId: mobile.id,
    });
    await this.jobCategoryRepository.save({
      name: 'iOS Developer',
      parentId: mobile.id,
    });

    // AI/ML sub
    await this.jobCategoryRepository.save({
      name: 'ML Engineer',
      parentId: aiml.id,
    });
    await this.jobCategoryRepository.save({
      name: 'AI Engineer',
      parentId: aiml.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Computer Vision Engineer',
      parentId: aiml.id,
    });
    await this.jobCategoryRepository.save({
      name: 'NLP Engineer',
      parentId: aiml.id,
    });
    await this.jobCategoryRepository.save({
      name: 'MLOps Engineer',
      parentId: aiml.id,
    });
    await this.jobCategoryRepository.save({
      name: 'AI Research Scientist',
      parentId: aiml.id,
    });

    // Data sub
    await this.jobCategoryRepository.save({
      name: 'Data Engineer',
      parentId: data.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Data Analyst',
      parentId: data.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Data Scientist',
      parentId: data.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Business Intelligence Developer',
      parentId: data.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Big Data Engineer',
      parentId: data.id,
    });

    // Cybersecurity sub
    await this.jobCategoryRepository.save({
      name: 'Penetration Tester',
      parentId: cybersecurity.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Security Engineer',
      parentId: cybersecurity.id,
    });
    await this.jobCategoryRepository.save({
      name: 'SOC Analyst',
      parentId: cybersecurity.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Malware Analyst',
      parentId: cybersecurity.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Security Researcher',
      parentId: cybersecurity.id,
    });

    // Embedded sub
    await this.jobCategoryRepository.save({
      name: 'Embedded Software Engineer',
      parentId: embedded.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Firmware Engineer',
      parentId: embedded.id,
    });
    await this.jobCategoryRepository.save({
      name: 'FPGA Engineer',
      parentId: embedded.id,
    });
    await this.jobCategoryRepository.save({
      name: 'IoT Engineer',
      parentId: embedded.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Automotive Software Engineer',
      parentId: embedded.id,
    });

    // Network sub
    await this.jobCategoryRepository.save({
      name: 'Network Engineer',
      parentId: network.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Network Administrator',
      parentId: network.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Network Security Engineer',
      parentId: network.id,
    });
    await this.jobCategoryRepository.save({
      name: 'SDN Engineer',
      parentId: network.id,
    });

    // QA/Testing sub
    await this.jobCategoryRepository.save({
      name: 'QA Engineer',
      parentId: testing.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Automation Test Engineer',
      parentId: testing.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Performance Test Engineer',
      parentId: testing.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Manual Tester',
      parentId: testing.id,
    });

    // UI/UX sub
    await this.jobCategoryRepository.save({
      name: 'UI Designer',
      parentId: uiux.id,
    });
    await this.jobCategoryRepository.save({
      name: 'UX Designer',
      parentId: uiux.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Product Designer',
      parentId: uiux.id,
    });

    // Cloud sub
    await this.jobCategoryRepository.save({
      name: 'AWS Engineer',
      parentId: cloud.id,
    });
    await this.jobCategoryRepository.save({
      name: 'GCP Engineer',
      parentId: cloud.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Azure Engineer',
      parentId: cloud.id,
    });
    await this.jobCategoryRepository.save({
      name: 'Cloud Architect',
      parentId: cloud.id,
    });
  }

  public async findRoots(): Promise<JobCategory[]> {
    return await this.jobCategoryRepository.find({
      where: { parentId: IsNull() },
      relations: ['childCategories'],
    });
  }

  public async findAll(): Promise<JobCategory[]> {
    return await this.jobCategoryRepository.find();
  }

  public async findById(id: number): Promise<JobCategory> {
    const category = await this.jobCategoryRepository.findOne({
      where: { id },
      relations: ['childCategories'],
    });

    if (!category) throw new NotFoundException('Category not found !');
    return category;
  }
}
