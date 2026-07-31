import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    // Хешируем пароль из DTO
    const hash = await bcrypt.hash(dto.password, 10);

    // Создаем объект пользователя, подставляя захешированный пароль
    const newUser = this.usersRepository.create({
      ...dto,
      password: hash,
    });

    return await this.usersRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    // Проверяем совпадение введенного пароля с хешем в БД
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
}