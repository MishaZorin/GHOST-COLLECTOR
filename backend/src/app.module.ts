import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CasesModule } from './cases/cases.module';
import { CluesModule } from './clues/clues.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    // Подгружаем .env файл и делаем его доступным везде (isGlobal)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Подключаемся к PostgreSQL на порту 5439 (через строку в .env)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // Сам найдет Case и Clue сущности
      synchronize: true,     // Сам создаст таблицы в базе данных при старте
    }),
    
    CasesModule,
    CluesModule,
    AuthModule,
    UserModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}