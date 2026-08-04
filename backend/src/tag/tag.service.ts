import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    
    return 'This action adds a new tag';
  }

 
}
