import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CluesService } from './clues.service';
import { CluesController } from './clues.controller';
import { Clue } from './entities/clue.entity';
import { Case } from '../cases/entities/case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clue, Case])], // Регистрируем обе сущности
  controllers: [CluesController],
  providers: [CluesService],
})
export class CluesModule {}