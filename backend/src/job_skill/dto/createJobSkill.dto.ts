// src/job_skill/dto/createJobSkill.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateJobSkillDto {
  @ApiProperty({
    example: '67c9d8e2f1a2b3c4d5e6f7a8',
    description: 'ID của Job Post',
  })
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({
    example: 5,
    description: 'ID của Skill',
  })
  @IsNumber()
  @IsNotEmpty()
  skillId: number;
}
