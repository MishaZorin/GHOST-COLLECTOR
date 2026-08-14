import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Req,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  create(
    @Body() createCaseDto: CreateCaseDto,
    @Req() req: any,
  ) {
    return this.casesService.create(
      createCaseDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.casesService.findAll(req.user.userId);
  }

  @Post(':id/tags')
  addTagToCase(
    @Param('id') caseId: string,
    @Body('tag') tag: string,
    @Req() req: any,
  ) {
    return this.casesService.addTagToCase({
      caseId,
      tag,
      userId: req.user.userId,
    });
  }

  @Delete(':id/tags')
  deleteCaseTag(
    @Param('id') caseId: string,
    @Body('tag') tag: string,
    @Req() req: any,
  ) {
    return this.casesService.deleteCaseTag({
      caseId,
      tag,
      userId: req.user.userId,
    });
  }
}