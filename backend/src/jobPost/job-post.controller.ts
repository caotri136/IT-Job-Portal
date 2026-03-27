// src/jobPost/job-post.controller
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/CreatePost.dto';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { FilterPostDto } from './dto/FilterPost.dto';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Job Post')
@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobpostService: JobPostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo job post mới' })
  @ApiBody({ type: CreatePostDto })
  public async createPost(@Request() req, @Body() post: CreatePostDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.jobpostService.createPost(req.user.sub, post);
  }

  @Put(':post-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật job post' })
  @ApiParam({ name: 'post-id', type: String })
  @ApiBody({ type: UpdatePostDto })
  public async updatePost(
    @Request() req,
    @Param('post-id') postId: string,
    @Body() newPost: UpdatePostDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.jobpostService.updatePost(req.user.sub, postId, newPost);
  }

  @Delete(':post-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa job post' })
  @ApiParam({ name: 'post-id', type: String })
  public async deletePost(@Request() req, @Param('post-id') postId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.jobpostService.deletePost(req.user.sub, postId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách job post có lọc và phân trang' })
  @ApiQuery({ type: FilterPostDto })
  public async getAllPosts(@Query() filter: FilterPostDto) {
    return await this.jobpostService.getAllPostsWithFilter(filter);
  }

  @Get('employer/my-posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer xem danh sách job post của mình' })
  public async getMyPosts(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.jobpostService.getMyPosts(req.user.sub);
  }

  @Get('match/:resumeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tìm job phù hợp với resume' })
  @ApiParam({ name: 'resumeId', type: String })
  public async findMatchingJobs(@Param('resumeId') resumeId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.jobpostService.findMatchingJobs(resumeId);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Lấy chi tiết một job post theo ID' })
  @ApiParam({ name: 'post-id', type: String })
  public async getPost(@Param('postId') postId: string) {
    return this.jobpostService.findById(postId);
  }
}
