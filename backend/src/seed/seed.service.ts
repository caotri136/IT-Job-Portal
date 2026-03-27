import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/candidate.entity';
import { Company } from 'src/company/company.entity';
import { Employer } from 'src/employer/employer.entity';
import { JobCategory } from 'src/job_category/job_category.entity';
import { JobSkill } from 'src/job_skill/job_skill.entity';
import { JobPost } from 'src/jobPost/jobPost.entity';
import { Resume } from 'src/resume/resume.entity';
import { ResumeSkill } from 'src/resume_skill/resume_skill.entity';
import { Skill } from 'src/skill/skill.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Candidate) private candidateRepo: Repository<Candidate>,
    @InjectRepository(Employer) private employerRepo: Repository<Employer>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(JobPost) private jobPostRepo: Repository<JobPost>,
    @InjectRepository(JobSkill) private jobSkillRepo: Repository<JobSkill>,
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeSkill)
    private resumeSkillRepo: Repository<ResumeSkill>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
    @InjectRepository(JobCategory)
    private categoryRepo: Repository<JobCategory>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedData();
  }

  private async seedData() {
    const existingUser = await this.userRepo.findOne({
      where: { email: 'employer1@test.com' },
    });
    if (existingUser) return;

    const hashPass = await bcrypt.hash('Test@123', 9);

    const getSkill = async (name: string) => {
      const skill = await this.skillRepo.findOne({ where: { name } });
      return skill?.id;
    };

    const getCategory = async (name: string) => {
      const cat = await this.categoryRepo.findOne({ where: { name } });
      return cat?.id;
    };

    // ===== EMPLOYER USERS trước =====
    const emp1User = await this.userRepo.save({
      name: 'Nguyen Van Employer',
      email: 'employer1@test.com',
      birthDay: new Date('1990-01-01'),
      password: hashPass,
      verified: true,
    });

    const emp2User = await this.userRepo.save({
      name: 'Tran Thi Employer',
      email: 'employer2@test.com',
      birthDay: new Date('1988-05-15'),
      password: hashPass,
      verified: true,
    });

    const emp3User = await this.userRepo.save({
      name: 'Le Van Employer',
      email: 'employer3@test.com',
      birthDay: new Date('1985-09-20'),
      password: hashPass,
      verified: true,
    });

    // ===== COMPANIES sau — dùng id thật =====
    const company1 = await this.companyRepo.save({
      name: 'TechViet Corp',
      address: 'Hồ Chí Minh',
      description: 'Công ty phần mềm hàng đầu Việt Nam',
      ownerId: emp1User.id,
    });

    const company2 = await this.companyRepo.save({
      name: 'AI Solutions Vietnam',
      address: 'Hà Nội',
      description: 'Chuyên về AI và Data Science',
      ownerId: emp2User.id,
    });

    const company3 = await this.companyRepo.save({
      name: 'CloudBase Vietnam',
      address: 'Đà Nẵng',
      description: 'Cloud và DevOps solutions',
      ownerId: emp3User.id,
    });

    // ===== EMPLOYER PROFILES =====
    await this.employerRepo.save({
      id: emp1User.id,
      position: 'HR Manager',
      phone: '0901234567',
      company: { id: company1.id },
    });

    await this.employerRepo.save({
      id: emp2User.id,
      position: 'Technical Lead',
      phone: '0912345678',
      company: { id: company2.id },
    });

    await this.employerRepo.save({
      id: emp3User.id,
      position: 'CTO',
      phone: '0923456789',
      company: { id: company3.id },
    });

    // ===== CANDIDATE USERS =====
    const can1User = await this.userRepo.save({
      name: 'Pham Van Backend',
      email: 'backend@test.com',
      birthDay: new Date('2002-03-10'),
      password: hashPass,
      verified: true,
    });
    await this.candidateRepo.save({ id: can1User.id });

    const can2User = await this.userRepo.save({
      name: 'Nguyen Thi Frontend',
      email: 'frontend@test.com',
      birthDay: new Date('2001-07-22'),
      password: hashPass,
      verified: true,
    });
    await this.candidateRepo.save({ id: can2User.id });

    const can3User = await this.userRepo.save({
      name: 'Tran Van AI',
      email: 'aidev@test.com',
      birthDay: new Date('2000-11-05'),
      password: hashPass,
      verified: true,
    });
    await this.candidateRepo.save({ id: can3User.id });

    const can4User = await this.userRepo.save({
      name: 'Le Thi DevOps',
      email: 'devops@test.com',
      birthDay: new Date('1999-06-15'),
      password: hashPass,
      verified: true,
    });
    await this.candidateRepo.save({ id: can4User.id });

    // ===== JOB POSTS =====
    const saveJob = async (data: any, skillNames: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const job = await this.jobPostRepo.save(data);
      for (const name of skillNames) {
        const skillId = await getSkill(name);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        if (skillId) await this.jobSkillRepo.save({ jobId: job.id, skillId });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return job;
    };

    await saveJob(
      {
        title: 'Intern NestJS Backend Developer',
        description:
          'Tuyển intern backend NestJS + PostgreSQL. Yêu cầu biết TypeScript cơ bản.',
        salaryMin: 3000000,
        salaryMax: 5000000,
        jobType: 'Intern',
        level: 'Intern',
        role: 'Backend',
        jobScope: 'Onsite',
        deadline: new Date('2026-06-30'),
        employerId: emp1User.id,
        categoryId: await getCategory('NestJS Developer'),
      },
      ['NestJS', 'PostgreSQL', 'TypeScript', 'Docker'],
    );

    await saveJob(
      {
        title: 'Junior Spring Boot Developer',
        description:
          'Tuyển junior backend Java Spring Boot. Có kinh nghiệm MySQL.',
        salaryMin: 8000000,
        salaryMax: 12000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'Backend',
        jobScope: 'Hybrid',
        deadline: new Date('2026-05-30'),
        employerId: emp1User.id,
        categoryId: await getCategory('Spring Boot Developer'),
      },
      ['Spring Boot', 'Java', 'MySQL', 'Docker'],
    );

    await saveJob(
      {
        title: 'Middle Node.js Developer',
        description: 'Tuyển middle backend Node.js. Yêu cầu MongoDB và Redis.',
        salaryMin: 15000000,
        salaryMax: 25000000,
        jobType: 'Fulltime',
        level: 'Middle',
        role: 'Backend',
        jobScope: 'Remote',
        deadline: new Date('2026-04-30'),
        employerId: emp1User.id,
        categoryId: await getCategory('Backend'),
      },
      ['Express', 'MongoDB', 'Redis', 'TypeScript'],
    );

    await saveJob(
      {
        title: 'Senior Go Developer',
        description:
          'Tuyển senior backend Go. Yêu cầu kinh nghiệm microservices.',
        salaryMin: 30000000,
        salaryMax: 50000000,
        jobType: 'Fulltime',
        level: 'Senior',
        role: 'Backend',
        jobScope: 'Remote',
        deadline: new Date('2026-04-15'),
        employerId: emp1User.id,
        categoryId: await getCategory('Backend'),
      },
      ['Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    );

    await saveJob(
      {
        title: 'Intern React Developer',
        description: 'Tuyển intern frontend React. Biết TypeScript là lợi thế.',
        salaryMin: 3000000,
        salaryMax: 5000000,
        jobType: 'Intern',
        level: 'Intern',
        role: 'Frontend',
        jobScope: 'Onsite',
        deadline: new Date('2026-06-30'),
        employerId: emp2User.id,
        categoryId: await getCategory('React Developer'),
      },
      ['React', 'TypeScript', 'JavaScript'],
    );

    await saveJob(
      {
        title: 'Junior Vue Developer',
        description: 'Tuyển junior frontend Vue.js + NuxtJS.',
        salaryMin: 7000000,
        salaryMax: 10000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'Frontend',
        jobScope: 'Hybrid',
        deadline: new Date('2026-05-15'),
        employerId: emp2User.id,
        categoryId: await getCategory('Vue Developer'),
      },
      ['Vue', 'JavaScript', 'NuxtJS'],
    );

    await saveJob(
      {
        title: 'Middle NextJS Developer',
        description:
          'Tuyển middle frontend NextJS. Yêu cầu TypeScript và React.',
        salaryMin: 15000000,
        salaryMax: 22000000,
        jobType: 'Fulltime',
        level: 'Middle',
        role: 'Frontend',
        jobScope: 'Remote',
        deadline: new Date('2026-04-30'),
        employerId: emp2User.id,
        categoryId: await getCategory('Frontend'),
      },
      ['NextJS', 'React', 'TypeScript', 'JavaScript'],
    );

    await saveJob(
      {
        title: 'Intern ML Engineer',
        description:
          'Tuyển intern Machine Learning. Yêu cầu Python và kiến thức cơ bản về ML.',
        salaryMin: 4000000,
        salaryMax: 6000000,
        jobType: 'Intern',
        level: 'Intern',
        role: 'AI/ML',
        jobScope: 'Onsite',
        deadline: new Date('2026-06-30'),
        employerId: emp2User.id,
        categoryId: await getCategory('ML Engineer'),
      },
      ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
    );

    await saveJob(
      {
        title: 'Junior NLP Engineer',
        description:
          'Tuyển junior NLP Engineer. Yêu cầu PyTorch và Hugging Face.',
        salaryMin: 10000000,
        salaryMax: 15000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'AI/ML',
        jobScope: 'Remote',
        deadline: new Date('2026-05-30'),
        employerId: emp2User.id,
        categoryId: await getCategory('NLP Engineer'),
      },
      ['Python', 'PyTorch', 'NLP', 'Hugging Face'],
    );

    await saveJob(
      {
        title: 'Middle Computer Vision Engineer',
        description: 'Tuyển middle CV Engineer. Yêu cầu OpenCV và YOLO.',
        salaryMin: 18000000,
        salaryMax: 28000000,
        jobType: 'Fulltime',
        level: 'Middle',
        role: 'AI/ML',
        jobScope: 'Hybrid',
        deadline: new Date('2026-04-30'),
        employerId: emp2User.id,
        categoryId: await getCategory('Computer Vision Engineer'),
      },
      ['Python', 'OpenCV', 'PyTorch', 'Computer Vision', 'YOLO'],
    );

    await saveJob(
      {
        title: 'Junior DevOps Engineer',
        description: 'Tuyển junior DevOps. Yêu cầu Docker và Linux.',
        salaryMin: 10000000,
        salaryMax: 18000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'DevOps',
        jobScope: 'Hybrid',
        deadline: new Date('2026-04-30'),
        employerId: emp3User.id,
        categoryId: await getCategory('DevOps Engineer'),
      },
      ['Docker', 'Kubernetes', 'Linux', 'CI/CD'],
    );

    await saveJob(
      {
        title: 'AWS Cloud Engineer',
        description: 'Tuyển Cloud Engineer chuyên AWS. Yêu cầu Terraform.',
        salaryMin: 20000000,
        salaryMax: 35000000,
        jobType: 'Fulltime',
        level: 'Middle',
        role: 'DevOps',
        jobScope: 'Remote',
        deadline: new Date('2026-04-15'),
        employerId: emp3User.id,
        categoryId: await getCategory('AWS Engineer'),
      },
      ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    );

    await saveJob(
      {
        title: 'Senior Site Reliability Engineer',
        description: 'Tuyển senior SRE. Yêu cầu Kubernetes và monitoring.',
        salaryMin: 35000000,
        salaryMax: 55000000,
        jobType: 'Fulltime',
        level: 'Senior',
        role: 'DevOps',
        jobScope: 'Remote',
        deadline: new Date('2026-04-15'),
        employerId: emp3User.id,
        categoryId: await getCategory('Site Reliability Engineer'),
      },
      ['Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'Linux', 'Terraform'],
    );

    await saveJob(
      {
        title: 'Junior Fullstack Developer',
        description: 'Tuyển junior fullstack React + NestJS.',
        salaryMin: 10000000,
        salaryMax: 15000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'Fullstack',
        jobScope: 'Hybrid',
        deadline: new Date('2026-05-30'),
        employerId: emp3User.id,
        categoryId: await getCategory('Fullstack'),
      },
      ['React', 'NestJS', 'PostgreSQL', 'TypeScript'],
    );

    await saveJob(
      {
        title: 'Senior Fullstack Developer',
        description: 'Tuyển senior fullstack. Yêu cầu React + NestJS + Docker.',
        salaryMin: 30000000,
        salaryMax: 50000000,
        jobType: 'Fulltime',
        level: 'Senior',
        role: 'Fullstack',
        jobScope: 'Remote',
        deadline: new Date('2026-04-30'),
        employerId: emp3User.id,
        categoryId: await getCategory('Fullstack'),
      },
      ['React', 'NestJS', 'PostgreSQL', 'TypeScript', 'Docker', 'Redis'],
    );

    await saveJob(
      {
        title: 'Junior Data Engineer',
        description: 'Tuyển junior Data Engineer. Yêu cầu Python và Spark.',
        salaryMin: 10000000,
        salaryMax: 16000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'Data',
        jobScope: 'Hybrid',
        deadline: new Date('2026-05-30'),
        employerId: emp2User.id,
        categoryId: await getCategory('Data Engineer'),
      },
      ['Python', 'Spark', 'Kafka', 'PostgreSQL', 'Airflow'],
    );

    await saveJob(
      {
        title: 'Data Analyst',
        description: 'Tuyển Data Analyst. Yêu cầu SQL và Power BI.',
        salaryMin: 8000000,
        salaryMax: 14000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'Data',
        jobScope: 'Onsite',
        deadline: new Date('2026-05-15'),
        employerId: emp2User.id,
        categoryId: await getCategory('Data Analyst'),
      },
      ['Python', 'Pandas', 'Power BI', 'PostgreSQL'],
    );

    // ===== RESUMES =====
    const saveResume = async (data: any, skillNames: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const resume = await this.resumeRepo.save(data);
      for (const name of skillNames) {
        const skillId = await getSkill(name);
        if (skillId)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          await this.resumeSkillRepo.save({ resumeId: resume.id, skillId });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resume;
    };

    await saveResume(
      {
        candidateId: can1User.id,
        title: 'Backend Intern CV',
        level: 'Intern',
        role: 'Backend',
        jobScope: 'Onsite',
        education: 'HCMUT',
        major: 'Computer Science',
        cvUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
      },
      ['NestJS', 'PostgreSQL', 'TypeScript', 'Docker'],
    );

    await saveResume(
      {
        candidateId: can2User.id,
        title: 'Frontend Intern CV',
        level: 'Intern',
        role: 'Frontend',
        jobScope: 'Hybrid',
        education: 'HCMUS',
        major: 'Software Engineering',
        cvUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
      },
      ['React', 'TypeScript', 'JavaScript', 'NextJS'],
    );

    await saveResume(
      {
        candidateId: can3User.id,
        title: 'AI Engineer CV',
        level: 'Intern',
        role: 'AI/ML',
        jobScope: 'Remote',
        education: 'UIT',
        major: 'Artificial Intelligence',
        cvUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
      },
      ['Python', 'PyTorch', 'NLP', 'Hugging Face', 'TensorFlow'],
    );

    await saveResume(
      {
        candidateId: can4User.id,
        title: 'DevOps Engineer CV',
        level: 'Junior',
        role: 'DevOps',
        jobScope: 'Remote',
        education: 'HCMUT',
        major: 'Computer Engineering',
        cvUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
      },
      ['Docker', 'Kubernetes', 'Linux', 'AWS', 'Terraform', 'CI/CD'],
    );

    console.log('✅ Seed data completed successfully!');
  }
}
