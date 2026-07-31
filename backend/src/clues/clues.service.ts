import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clue } from './entities/clue.entity';
import { Case } from '../cases/entities/case.entity';
import { CreateClueDto } from './dto/create-clue.dto';

@Injectable()
export class CluesService {
  constructor(
    @InjectRepository(Clue)
    private readonly cluesRepository: Repository<Clue>,
    @InjectRepository(Case)
    private readonly casesRepository: Repository<Case>,
  ) {}

  async create(createClueDto: CreateClueDto) {
    // 1. Проверяем, существует ли такой кейс
    const foundCase = await this.casesRepository.findOneBy({ id: createClueDto.caseId });
    if (!foundCase) {
      throw new NotFoundException(`Case with ID ${createClueDto.caseId} not found`);
    }

    // 2. Создаем улику и привязываем к ней найденный кейс
    const newClue = this.cluesRepository.create({
      title: createClueDto.title,
      url: createClueDto.url,
      case: foundCase,
    });

    // 3. Сохраняем в PostgreSQL
    return await this.cluesRepository.save(newClue);
  }
  async deleteClue(id: string) {
  const result = await this.cluesRepository.delete(id);
  
  if (result.affected === 0) {
    throw new NotFoundException(`Clue with ID ${id} not found`);
  }
  
  return { message: `Clue with ID ${id} successfully deleted` };
}
}