// src/company/company.controller
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/CreateCompany.dto';
import { UpdateCompanyDto } from './dto/UpdateCompany.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo công ty mới' })
  @ApiBody({ type: CreateCompanyDto })
  public async createCompany(@Body() data: CreateCompanyDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.companyService.createCompany(data, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả công ty' })
  public async getAllCompanies() {
    return await this.companyService.findAll();
  }

  @Get('search/:name')
  @ApiOperation({ summary: 'Tìm công ty theo tên' })
  @ApiParam({ name: 'name', type: String })
  public async findCompanyByName(@Param('name') name: string) {
    return await this.companyService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin công ty theo ID' })
  @ApiParam({ name: 'id', type: String })
  public async getCompany(@Param('id') id: string) {
    return await this.companyService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin công ty' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCompanyDto })
  public async updateCompany(
    @Body() data: UpdateCompanyDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.companyService.updateCompany(data, id, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa công ty' })
  @ApiParam({ name: 'id', type: String })
  public async deleteCompany(@Param('id') id: string, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return await this.companyService.deleteCompany(id, req.user.sub);
  }
}
