import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto, @CurrentUser() user: JwtPayload) {
    return this.bidService.create(createBidDto, user);
  }

  @Get()
  findAll() {
    return this.bidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(+id, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bidService.remove(+id);
  }
}
