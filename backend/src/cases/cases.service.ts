import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Исправили путь импорта
import { Repository } from 'typeorm'; // Добавили импорт самого класса Репозитория
import { Case } from './entities/case.entity'; // Добавили импорт нашей сущности Case
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

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


async findAll() {
  return await this.casesRepository.find({
    relations: {
      clues: true, // Говорим: "Да, подтяни связь clues"
    },
  });
}
}