import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotifiactionService } from './notifiaction.service';
import { CreateNotifiactionDto } from './dto/create-notifiaction.dto';
import { UpdateNotifiactionDto } from './dto/update-notifiaction.dto';
import type { JwtPayload } from '../auth/decorators/types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notifiaction')
export class NotifiactionController {
  constructor(private readonly notifiactionService: NotifiactionService) {}

  @Post()
  create(
    @Body() createNotifiactionDto: CreateNotifiactionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notifiactionService.create(createNotifiactionDto, +user?.uid);
  }

  @Get()
  findAll() {
    return this.notifiactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifiactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotifiactionDto: UpdateNotifiactionDto,
  ) {
    return this.notifiactionService.update(+id, updateNotifiactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifiactionService.remove(+id);
  }
}
