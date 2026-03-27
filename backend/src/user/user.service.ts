// src/user/user.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // every hour, in minute 0th
  @Cron('0 * * * *')
  async removeUnverifiedUsers() {
    await this.userRepository.delete({
      verified: false,
      expired_at: LessThan(new Date()),
    });
  }

  public async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...data,
    });

    return await this.userRepository.save(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    // take the account
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  public async findById(id: string): Promise<User | null> {
    // take the account
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  public async updateUser(id: string, data: UpdateUserDto): Promise<void> {
    const result = await this.userRepository.update(
      { id: id },
      { name: data.name, birthDay: data.birthDay },
    );

    if (result.affected === 0) {
      throw new NotFoundException('User Not Found');
    }
  }

  public async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete({ id: id });
    if (result.affected === 0) {
      throw new NotFoundException('User Not Found');
    }
  }

  public async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
