import { Controller, Get, Post, Body, UseGuards,Param,Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  @Get()
  findAll() {
    return this.casesService.findAll();
  }
  // src/cases/cases.controller.ts
@Post(':id/tags')
addTagToCase(
  @Param('id') caseId: string,
  @Body('tag') tag: string,
) {
  return this.casesService.addTagToCase({ caseId, tag });
}
@Delete(':id/tags')
deleteCaseTag(
  @Param('id') caseId: string,
  @Body('tag') tag: string,
){
  return this.casesService.deleteCaseTag({ caseId, tag });
}

}