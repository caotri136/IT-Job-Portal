// src/skill/skill.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillCategory } from './skillCategory.enum';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  public async findAll(@Query('category') category?: SkillCategory) {
    if (category) return await this.skillService.findByCategory(category);
    return await this.skillService.findAll();
  }
}
