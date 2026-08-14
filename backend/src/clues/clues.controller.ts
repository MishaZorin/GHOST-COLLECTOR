import {
  Controller,
  Post,
  Body,
  Delete,
  HttpCode,
  Param,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CluesService } from './clues.service';
import { CreateClueDto } from './dto/create-clue.dto';

@Controller('clues')
@UseGuards(JwtAuthGuard)
export class CluesController {
  constructor(private readonly cluesService: CluesService) {}

  @Post()
  create(
    @Body() createClueDto: CreateClueDto,
    @Req() req: any,
  ) {
    return this.cluesService.create(
      createClueDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteClue(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.cluesService.deleteClue(
      id,
      req.user.userId,
    );
  }
}