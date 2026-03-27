// src/employer/employer.service
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employer } from './employer.entity';
import { UpdateEmployerDto } from './dto/CreateEmployer.dto';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
  ) {}

  public async createEmployer(
    userId: string,
    companyId: string,
  ): Promise<Employer> {
    // Kiểm tra user đã là employer chưa
    const existing = await this.employerRepository.findOne({
      where: { id: userId },
    });
    if (existing) throw new ConflictException('You are already employer !');

    const employer = new Employer();
    employer.id = userId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    employer.company = { id: companyId } as any;

    return await this.employerRepository.save(employer);
  }

  public async findById(id: string): Promise<Employer | null> {
    return await this.employerRepository.findOne({
      where: { id },
      relations: ['company', 'user'],
    });
  }

  public async updateProfile(
    id: string,
    data: UpdateEmployerDto,
  ): Promise<void> {
    const employer = await this.findById(id);
    if (employer === null)
      throw new NotFoundException('This account does not exist !');

    if (data.position) employer.position = data.position;
    if (data.phone) employer.phone = data.phone;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (data.companyId) employer.company = { id: data.companyId } as any;

    await this.employerRepository.save(employer);
  }

  public async getProfile(id: string): Promise<Employer | null> {
    return await this.findById(id);
  }

  public async quitJob(id: string): Promise<void> {
    const employer = await this.employerRepository.findOne({
      where: { id: id },
      relations: ['jobPosts'],
    });
    if (!employer) throw new NotFoundException();

    // CASE automatically delete JobPosts
    await this.employerRepository.delete(id);
  }
}
