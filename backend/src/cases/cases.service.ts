import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Case } from './entities/case.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { CreateTagDto } from '../tag/dto/create-tag.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private readonly casesRepository: Repository<Case>,
  ) {}

  // Создание case для текущего пользователя
  async create(createCaseDto: CreateCaseDto, userId: string) {
    const newCase = this.casesRepository.create({
      ...createCaseDto,
      userId,
    });

    return await this.casesRepository.save(newCase);
  }

  // Получаем ТОЛЬКО cases текущего пользователя
  async findAll(userId: string) {
    return await this.casesRepository.find({
      where: {
        userId,
      },
      relations: {
        clues: true,
      },
    });
  }
  async getCase(caseId: string) {
  return this.casesRepository.findOne({
    where: {
      id: caseId,
    },
     relations: {
      clues: true,
    },
  });
}

  // Добавить тег только в свой case
  async addTagToCase(dto: CreateTagDto & { userId: string }) {
    const foundCase = await this.casesRepository.findOne({
      where: {
        id: dto.caseId,
        userId: dto.userId,
      },
    });

    if (!foundCase) {
      throw new NotFoundException('Case not found');
    }

    const tag = dto.tag.trim();

    if (!tag) {
      throw new BadRequestException('Tag cannot be empty');
    }

    const tags = foundCase.tags ?? [];

    if (!tags.includes(tag)) {
      foundCase.tags = [...tags, tag];

      await this.casesRepository.save(foundCase);
    }

    return foundCase;
  }

  // Удалить тег только из своего case
  async deleteCaseTag(dto: CreateTagDto & { userId: string }) {
    const foundCase = await this.casesRepository.findOne({
      where: {
        id: dto.caseId,
        userId: dto.userId,
      },
    });

    if (!foundCase) {
      throw new NotFoundException('Case not found');
    }

    const tag = dto.tag.trim();

    foundCase.tags = (foundCase.tags ?? []).filter(
      (t) => t !== tag,
    );

    await this.casesRepository.save(foundCase);

    return foundCase;
  }
}