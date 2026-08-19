import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  async create(
    createClueDto: CreateClueDto,
    userId: string,
  ) {
    // Ищем case ТОЛЬКО среди cases текущего пользователя
    const foundCase = await this.casesRepository.findOne({
      where: {
        id: createClueDto.caseId,
        userId: userId,
      },
    });

    if (!foundCase) {
      throw new NotFoundException('Case not found');
    }

    const newClue = this.cluesRepository.create({
      title: createClueDto.title,
      url: createClueDto.url,
      case: foundCase,
      caseId: foundCase.id,
    });

    return await this.cluesRepository.save(newClue);
  }
  async getAllClues(){
    return await this.casesRepository.find()
  }

  async deleteClue(
    id: string,
    userId: string,
  ) {
    // Сначала находим clue вместе с его case
    const clue = await this.cluesRepository.findOne({
      where: {
        id,
      },
      relations: {
        case: true,
      },
    });

    if (!clue) {
      throw new NotFoundException('Clue not found');
    }

    // Проверяем владельца case
    if (clue.case.userId !== userId) {
      throw new NotFoundException('Clue not found');
    }

    await this.cluesRepository.delete(id);

    return {
      message: `Clue with ID ${id} successfully deleted`,
    };
  }
}