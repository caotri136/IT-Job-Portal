// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('IT Job Portal (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let employerToken: string;
  let candidateToken: string;
  let companyId: string;
  let jobPostId: string;
  let resumeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    // Lấy employer token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const empRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'employer1@test.com', password: 'Test@123' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    employerToken = empRes.body.access_token;

    // Lấy candidate token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const canRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'backend@test.com', password: 'Test@123' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    candidateToken = canRes.body.access_token;

    // Tạo job post test dùng xuyên suốt
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const jobRes = await request(app.getHttpServer())
      .post('/job-post')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        title: 'E2E Test Job',
        description: 'Test job description',
        salaryMin: 5000000,
        salaryMax: 10000000,
        jobType: 'Fulltime',
        level: 'Junior',
        role: 'Backend',
        jobScope: 'Remote',
        deadline: '2026-12-31',
        categoryId: 1,
        skillIds: [21, 40, 4],
      });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    jobPostId = jobRes.body.id;

    console.log('jobRes status:', jobRes.status);
    console.log('jobRes body:', jobRes.body);
    jobPostId = jobRes.body.id;
    console.log('jobPostId:', jobPostId);

    // Lấy resumeId từ seed data
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const resumeRes = await request(app.getHttpServer())
      .get('/resume/my-resumes')
      .set('Authorization', `Bearer ${candidateToken}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    resumeId = resumeRes.body[0].id;
  });

  afterAll(async () => {
    try {
      if (jobPostId) {
        await dataSource.query(
          `DELETE FROM "job_skill" WHERE "jobId" = '${jobPostId}'`,
        );
        await dataSource.query(
          `DELETE FROM "jobPost" WHERE id = '${jobPostId}'`,
        );
      }
      await dataSource.query(
        `DELETE FROM "user" WHERE email LIKE '%@e2etest.com'`,
      );
    } catch (e) {
      console.error('Cleanup error:', e);
    }
    await app.close();
  });

  // ===== AUTH =====
  describe('Auth', () => {
    it('POST /auth/register — success', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'E2E Test User',
          email: 'newuser@e2etest.com',
          password: 'Test@123',
          birthDay: '2000-01-01',
        });
      expect(res.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.message).toBe('OTP sent to email');
    });

    it('POST /auth/register — invalid email', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test',
          email: 'notanemail',
          password: 'Test@123',
          birthDay: '2000-01-01',
        });
      expect(res.status).toBe(400);
    });

    it('POST /auth/login — wrong password', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'employer1@test.com', password: 'WrongPass' });
      expect(res.status).toBe(401);
    });

    it('POST /auth/login — success', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'employer1@test.com', password: 'Test@123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
    });

    it('GET /auth/profile — success', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${employerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email');
    });

    it('GET /auth/profile — no token', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/auth/profile');
      expect(res.status).toBe(401);
    });

    it('POST /auth/logout — success', async () => {
      // Login riêng để test logout, không dùng employerToken
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'frontend@test.com', password: 'Test@123' });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const token = loginRes.body.access_token;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.message).toBe('Logout successfully !');
    });
  });

  // ===== COMPANY =====
  describe('Company', () => {
    it('GET /company — lấy tất cả company', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/company');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /company/search/:name — tìm theo tên', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get(
        '/company/search/TechViet Corp',
      );
      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.name).toBe('TechViet Corp');
    });

    it('GET /company/:id — lấy company theo id', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const allRes = await request(app.getHttpServer()).get('/company');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      companyId = allRes.body[0].id;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get(
        `/company/${companyId}`,
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
    });

    it('PUT /company/:id — update company', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .put(`/company/${companyId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ description: 'Updated description' });
      expect(res.status).toBe(200);
    });

    it('PUT /company/:id — không phải owner thì bị từ chối', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .put(`/company/${companyId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ description: 'Hack attempt' });
      expect(res.status).toBe(400);
    });
  });

  // ===== EMPLOYER =====
  describe('Employer', () => {
    it('GET /employer/profile — lấy profile employer', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get('/employer/profile')
        .set('Authorization', `Bearer ${employerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
    });

    it('PUT /employer/profile — update profile', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .put('/employer/profile')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ position: 'Senior HR', phone: '0909090909' });
      expect(res.status).toBe(200);
    });
  });

  // ===== JOB CATEGORY =====
  describe('JobCategory', () => {
    it('GET /job-category — lấy root categories', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/job-category');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /job-category/all — lấy tất cả categories', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/job-category/all');
      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(10);
    });

    it('GET /job-category/:id — lấy category theo id', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/job-category/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
    });
  });

  // ===== SKILL =====
  describe('Skill', () => {
    it('GET /skill — lấy tất cả skill', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/skill');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(100);
    });

    it('GET /skill?category=Framework — lấy skill theo category', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get(
        '/skill?category=Framework',
      );
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // ===== JOB POST =====
  describe('JobPost', () => {
    it('jobPostId đã được tạo trong beforeAll', () => {
      expect(jobPostId).toBeDefined();
    });

    it('GET /job-post — lấy tất cả job post', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get('/job-post');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('totalPages');
    });

    it('GET /job-post?level=Junior — filter theo level', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get(
        '/job-post?level=Junior&page=1&limit=5',
      );
      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.data).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      res.body.data.forEach((job: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(job.level).toBe('Junior');
      });
    });

    it('GET /job-post/employer/my-posts — employer xem post của mình', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get('/job-post/employer/my-posts')
        .set('Authorization', `Bearer ${employerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /job-post/:id — xem chi tiết job post', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get(
        `/job-post/${jobPostId}`,
      );
      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.id).toBe(jobPostId);
    });

    it('PUT /job-post/:id — update job post', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .put(`/job-post/${jobPostId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          title: 'Updated E2E Test Job',
          description: 'Updated description',
          jobType: 'Fulltime',
          level: 'Middle',
          role: 'Backend',
          jobScope: 'Hybrid',
          skillIds: [21, 40],
        });
      expect(res.status).toBe(200);
    });

    it('GET /job-post/match/:resumeId — matching jobs', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get(`/job-post/match/${resumeId}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
      // Job đầu tiên phải có matchCount >= job thứ hai
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (res.body.length > 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body[0].matchCount).toBeGreaterThanOrEqual(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          res.body[1].matchCount,
        );
      }
    });
  });

  // ===== RESUME =====
  describe('Resume', () => {
    it('resumeId đã được lấy trong beforeAll', () => {
      expect(resumeId).toBeDefined();
    });

    it('GET /resume/my-resumes — lấy resume của candidate', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get('/resume/my-resumes')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /resume/:id — xem chi tiết resume', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer()).get(`/resume/${resumeId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('resumeSkills');
    });
  });

  // ===== APPLICATION =====
  describe('Application', () => {
    let candidateId: string;

    beforeAll(async () => {
      // Lấy candidateId từ profile
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const profileRes = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${candidateToken}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      candidateId = profileRes.body.id;
    });

    it('POST /application/:jobpost-id — candidate apply job', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post(`/application/${jobPostId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ resumeId });
      expect(res.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('Pending');
    });

    it('POST /application/:jobpost-id — apply trùng thì bị từ chối', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post(`/application/${jobPostId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ resumeId });
      expect(res.status).toBe(400);
    });

    it('GET /application — candidate xem tất cả job đã apply', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get('/application')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /application/:jobpost-id — xem chi tiết application', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get(`/application/${jobPostId}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('Pending');
    });

    it('GET /application/jobpost/:jobpost-id — employer xem applications', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get(`/application/jobpost/${jobPostId}`)
        .set('Authorization', `Bearer ${employerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('PUT /application/accept/:jobpost-id/:candidate-id — employer accept', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .put(`/application/accept/${jobPostId}/${candidateId}`)
        .set('Authorization', `Bearer ${employerToken}`);
      expect(res.status).toBe(200);
    });

    it('GET /application/:jobpost-id — status đã là Accepted', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .get(`/application/${jobPostId}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('Accepted');
    });

    it('DELETE /application/:jobpost-id — candidate hủy apply', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .delete(`/application/${jobPostId}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(200);
    });

    it('DELETE /job-post/:id — employer xóa job post', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .delete(`/job-post/${jobPostId}`)
        .set('Authorization', `Bearer ${employerToken}`);
      expect(res.status).toBe(200);
      jobPostId = ''; // reset để afterAll không xóa lại
    });
  });
});
