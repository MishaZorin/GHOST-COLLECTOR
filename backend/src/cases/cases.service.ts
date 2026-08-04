import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Исправили путь импорта
import { Repository } from 'typeorm'; // Добавили импорт самого класса Репозитория
import { Case } from './entities/case.entity'; // Добавили импорт нашей сущности Case
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CreateTagDto } from '../tag/dto/create-tag.dto'; // Выходим из cases и идем в tag

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private readonly casesRepository: Repository<Case>, 
  ) {}

  async create(createCaseDto: CreateCaseDto){
    const newCase = this.casesRepository.create(createCaseDto)

    return await this.casesRepository.save(newCase)
  }
 
async addTagToCase(dto: CreateTagDto) {
  // dto: { caseId: string; tag: string }

  // 0. Находим кейс по ID
  const foundCase = await this.casesRepository.findOne({
    where: { id: dto.caseId },
  });

  if (!foundCase) {
    throw new NotFoundException(`Case with ID ${dto.caseId} not found`);
  }

  // 1. Берём тег из dto и чистим пробелы
  const tag = dto.tag.trim();
  if (!tag) {
    throw new BadRequestException('Tag cannot be empty');
  }

  // 2. Берём текущие теги кейса
  let tags: string[];

  if (foundCase.tags) {
    // если в кейсе уже есть теги
    tags = foundCase.tags;
  } else {
    // если тегов ещё нет
    tags = [];
  }

  // 3. Проверяем, есть ли уже такой тег
  const alreadyHasTag = tags.includes(tag);

  if (!alreadyHasTag) {
    // 4. Если такого тега нет — добавляем
    tags.push(tag);

    // 5. Сохраняем обратно в кейс
    foundCase.tags = tags;

    // 6. Пишем в базу
    await this.casesRepository.save(foundCase);
  }

  // 7. Возвращаем обновлённый кейс
  return foundCase;
}
async deleteCaseTag(dto: CreateTagDto) {
  const foundCase = await this.casesRepository.findOne({
    where: { id: dto.caseId },
  });

  if (!foundCase) {
    throw new NotFoundException(`Case with ID ${dto.caseId} not found`);
  }

  const tag = dto.tag.trim();

  foundCase.tags = (foundCase.tags ?? []).filter(t => t !== tag);

  await this.casesRepository.save(foundCase);

  return foundCase;
}


async findAll() {
  return await this.casesRepository.find({
    relations: {
      clues: true, // Говорим: "Да, подтяни связь clues"
    },
  });

  
}
}