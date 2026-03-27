import { Test, TestingModule } from '@nestjs/testing';
import { JobSkillService } from '../src/job_skill/job_skill.service';

describe('JobSkillService', () => {
  let service: JobSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobSkillService],
    }).compile();

    service = module.get<JobSkillService>(JobSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
