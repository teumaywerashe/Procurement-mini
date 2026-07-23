import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenderService } from './tender.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';

@Controller('tender')
export class TenderController {
  constructor(private readonly tenderService: TenderService) {}

  @Post()
  create(@Body() createTenderDto: CreateTenderDto) {
    return this.tenderService.create(createTenderDto);
  }

  @Get()
  findAll() {
    return this.tenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenderDto: UpdateTenderDto) {
    return this.tenderService.update(+id, updateTenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenderService.remove(+id);
  }
}
