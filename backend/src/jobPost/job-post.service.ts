// src/jobPost/job-post.service
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { JobPost } from './jobPost.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/CreatePost.dto';
import { JobSkillService } from 'src/job_skill/job_skill.service';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { ResumeSkill } from 'src/resume_skill/resume_skill.entity';
import { FilterPostDto } from './dto/FilterPost.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly jobSkillService: JobSkillService,
  ) {}

  public async createPost(id: string, data: CreatePostDto): Promise<JobPost> {
    const post = this.jobPostRepository.create({
      title: data.title,
      description: data.description,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      jobType: data.jobType,
      level: data.level,
      role: data.role,
      jobScope: data.jobScope,
      deadline: data.deadline,
      employerId: id,
      categoryId: data.categoryId,
    });
    await this.jobPostRepository.save(post);

    // Gắn skill vào job post
    if (data.skillIds && data.skillIds.length > 0) {
      const jobSkills = data.skillIds.map((skillId) => ({
        jobId: post.id,
        skillId,
      }));
      await this.jobSkillService.saveJobSkill(jobSkills);
    }

    return post;
  }

  public async findById(id: string): Promise<JobPost | null> {
    return await this.jobPostRepository.findOne({ where: { id: id } });
  }

  public async getMyPosts(id: string): Promise<JobPost[]> {
    return await this.jobPostRepository.find({
      where: { employerId: id },
      relations: ['category', 'jobSkills', 'jobSkills.skill'],
    });
  }

  public async getAllPosts(): Promise<JobPost[]> {
    return await this.jobPostRepository.find({
      relations: ['employer', 'category', 'jobSkills', 'jobSkills.skill'],
    });
  }

  public async updatePost(
    id: string,
    postId: string,
    data: UpdatePostDto,
  ): Promise<void> {
    const post = await this.findById(postId);
    if (post === null) throw new NotFoundException('Cannot find the post !');

    if (post.employerId !== id)
      throw new ForbiddenException('You cannot modify this post');

    await this.jobPostRepository.update(
      { id: post.id },
      {
        title: data.title,
        description: data.description,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        jobType: data.jobType,
        level: data.level,
        role: data.role,
        jobScope: data.jobScope,
        deadline: data.deadline,
        employerId: id,
        categoryId: data.categoryId,
      },
    );

    // update skill
    if (data.skillIds !== undefined) {
      await this.jobSkillService.deleteByJobId(postId);
      if (data.skillIds.length > 0) {
        const skills = data.skillIds.map((skillId) => ({
          jobId: postId,
          skillId,
        }));
        await this.jobSkillService.saveJobSkill(skills);
      }
    }
  }

  public async deletePost(id: string, postId: string): Promise<void> {
    const post = await this.jobPostRepository.findOne({
      where: { id: postId },
    });
    if (post === null) throw new NotFoundException('Cannot find the post !');

    if (post.employerId !== id)
      throw new ForbiddenException('You cannot delete this post');

    await this.jobPostRepository.delete({ id: post.id });
  }

  // match job phù hợp với skill trong resume
  public async findMatchingJobs(resumeId: string): Promise<any[]> {
    // bước 1: lấy skillIds của resume
    const resumeSkills = await this.jobPostRepository.manager
      .getRepository('resume_skill')
      .find({ where: { resumeId } });

    if (resumeSkills.length === 0) return [];

    const skillIds = resumeSkills.map((rs: ResumeSkill) => rs.skillId);

    // Bước 2: tìm job có skill trùng, sort theo matchCount
    // ý tưởng: Resume có skillIds: [1, 3, 7]  (NestJS, PostgreSQL, Docker)
    // JobPost A có skillIds: [1, 3]  → overlap 2 skill
    // JobPost B có skillIds: [5, 6]  → overlap 0 skill
    // JobPost C có skillIds: [1, 7, 9] → overlap 2 skill
    // tương tự với câu lệnh sql:
    // SELECT jp.*, COUNT(js.skillId) as matchCount
    // FROM job_post jp
    // JOIN job_skill js ON jp.id = js.jobId
    // WHERE js.skillId IN (
    //   SELECT skillId FROM resume_skill WHERE resumeId = :resumeId
    // )
    // GROUP BY jp.id
    // ORDER BY matchCount DESC
    const results = await this.jobPostRepository
      .createQueryBuilder('jp')
      .innerJoin('jp.jobSkills', 'js')
      .innerJoin('js.skill', 'skill')
      .leftJoinAndSelect('jp.category', 'category')
      .leftJoinAndSelect('jp.employer', 'employer')
      .where('js.skillId IN (:...skillIds)', { skillIds })
      .groupBy('jp.id, category.id, employer.id')
      .addSelect('COUNT(js.skillId)', 'matchCount')
      .orderBy('matchCount', 'DESC')
      .getRawAndEntities()
      .then(({ raw, entities }) => {
        // Gắn matchCount vào từng entity
        return entities.map((entity, index) => ({
          ...entity,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          matchCount: parseInt(raw[index].matchCount),
        }));
      });

    return results;
  }

  public async getAllPostsWithFilter(filter: FilterPostDto): Promise<{
    data: JobPost[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit; // ← bỏ qua bao nhiêu record

    // Xây dựng điều kiện WHERE động
    const where: FindOptionsWhere<JobPost> = {};

    // Chỉ thêm vào where nếu có giá trị
    if (filter.level) where.level = filter.level;
    if (filter.role) where.role = filter.role;
    if (filter.jobScope) where.jobScope = filter.jobScope;
    if (filter.jobType) where.jobType = filter.jobType;
    if (filter.categoryId) where.categoryId = filter.categoryId;

    // Salary range — phức tạp hơn một chút
    if (filter.salaryMin && filter.salaryMax) {
      where.salaryMin = MoreThanOrEqual(filter.salaryMin);
      where.salaryMax = LessThanOrEqual(filter.salaryMax);
    } else if (filter.salaryMin) {
      where.salaryMin = MoreThanOrEqual(filter.salaryMin);
    } else if (filter.salaryMax) {
      where.salaryMax = LessThanOrEqual(filter.salaryMax);
    }

    // findAndCount trả về [data, total] trong 1 query
    const [data, total] = await this.jobPostRepository.findAndCount({
      where,
      relations: ['employer', 'category', 'jobSkills', 'jobSkills.skill'],
      order: { createdAt: 'DESC' }, // mới nhất trước
      skip, // bỏ qua (page-1)*limit record
      take: limit, // lấy limit record
    });

    return {
      data,
      total, // tổng số record khớp filter
      page, // trang hiện tại
      limit, // số record mỗi trang
      totalPages: Math.ceil(total / limit), // tổng số trang
    };
  }
}
