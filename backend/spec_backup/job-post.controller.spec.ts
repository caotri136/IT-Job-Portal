import { Test, TestingModule } from '@nestjs/testing';
import { JobPostController } from '../src/jobPost/job-post.controller';

describe('JobPostController', () => {
  let controller: JobPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostController],
    }).compile();

    controller = module.get<JobPostController>(JobPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
