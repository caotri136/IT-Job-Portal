// src/company/company.service
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/CreateCompany.dto';
import { UpdateCompanyDto } from './dto/UpdateCompany.dto';
import { EmployerService } from 'src/employer/employer.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly employerService: EmployerService,
  ) {}

  public async createCompany(
    data: CreateCompanyDto,
    ownerId: string,
  ): Promise<Company> {
    const newEmployer = await this.employerService.findById(ownerId);
    if (newEmployer !== null)
      throw new BadRequestException('You are already employer !');

    const company = this.companyRepository.create({
      ...data,
      ownerId: ownerId,
    });
    await this.companyRepository.save(company);

    await this.employerService.createEmployer(ownerId, company.id);

    return company;
  }

  public async findById(id: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id: id },
    });
  }

  public async findByName(name: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { name: name },
    });
  }

  public async updateCompany(
    data: UpdateCompanyDto,
    id: string,
    ownerId: string,
  ): Promise<void> {
    const company = await this.findById(id);
    if (company === null) throw new NotFoundException('Company not found !');

    if (company.ownerId !== ownerId)
      throw new BadRequestException('You are not the owner !');

    const result = await this.companyRepository.update({ id: id }, { ...data });
    if (result.affected === 0)
      throw new NotFoundException('Company not found !');
  }

  public async deleteCompany(id: string, ownerId: string) {
    const company = await this.findById(id);
    if (company === null) throw new NotFoundException('Company not found !');

    if (company?.ownerId !== ownerId)
      throw new BadRequestException('You are not the owner !');

    const result = await this.companyRepository.delete({
      id: id,
    });

    if (result.affected === 0)
      throw new NotFoundException('Company not found !');
  }

  public async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      relations: ['employers', 'employers.jobPosts'],
    });
  }
}
