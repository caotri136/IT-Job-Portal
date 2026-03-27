import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Application } from './application/application.entity';
import { Candidate } from './candidate/candidate.entity';
import { Company } from './company/company.entity';
import { Employer } from './employer/employer.entity';
import { JobCategory } from './job_category/job_category.entity';
import { JobSkill } from './job_skill/job_skill.entity';
import { JobPost } from './jobPost/jobPost.entity';
import { Resume } from './resume/resume.entity';
import { ResumeSkill } from './resume_skill/resume_skill.entity';
import { Skill } from './skill/skill.entity';
import { CompanyModule } from './company/company.module';
import { EmployerModule } from './employer/employer.module';
import { JobCategoryModule } from './job_category/job_category.module';
import { SkillModule } from './skill/skill.module';
import { JobSkillModule } from './job_skill/job_skill.module';
import { ResumeModule } from './resume/resume.module';
import { ApplicationController } from './application/application.controller';
import { ApplicationModule } from './application/application.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'caotri136',
      password: process.env.DB_PASSWORD || 'coincard',
      database: process.env.DB_NAME || 'pet_pr1',
      synchronize: true,
      entities: [
        User,
        Application,
        Candidate,
        Company,
        Employer,
        JobCategory,
        JobSkill,
        JobPost,
        Resume,
        ResumeSkill,
        Skill,
      ],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CompanyModule,
    SkillModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"CS Job" <${process.env.MAIL_USER}>`,
      },
    }),
    EmployerModule,
    JobCategoryModule,
    JobSkillModule,
    ResumeModule,
    ApplicationModule,
    SeedModule,
  ],
  controllers: [AppController, ApplicationController],
  providers: [AppService],
})
export class AppModule {}
