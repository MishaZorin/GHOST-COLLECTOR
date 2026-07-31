import { Controller, Post, Body,Delete,HttpCode,Param,HttpStatus } from '@nestjs/common';
import { CluesService } from './clues.service';
import { CreateClueDto } from './dto/create-clue.dto';

@Controller('clues')
export class CluesController {
  constructor(private readonly cluesService: CluesService) {}

  @Post()
  create(@Body() createClueDto: CreateClueDto) {
    return this.cluesService.create(createClueDto);
  }
    @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteClue(@Param('id') id: string) {
    return this.cluesService.deleteClue(id);
  }
}