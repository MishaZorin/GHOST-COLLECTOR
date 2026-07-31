import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { Case } from './entities/case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Case])], // Регистрируем репозиторий Case
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService], // Экспортируем сервис, чтобы модуль Clues мог связывать улики с кейсами
})
export class CasesModule {}