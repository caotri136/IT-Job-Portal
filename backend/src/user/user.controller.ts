// src/user/user.controller
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userSerVice: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.userSerVice.create(data);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Tìm người dùng theo email' })
  @ApiParam({ name: 'email', type: String })
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.userSerVice.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm người dùng theo ID' })
  @ApiParam({ name: 'id', type: String })
  public async findById(@Param('id') id: string): Promise<User | null> {
    return await this.userSerVice.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  public async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<void> {
    return await this.userSerVice.updateUser(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiParam({ name: 'id', type: String })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userSerVice.deleteUser(id);
  }
}
