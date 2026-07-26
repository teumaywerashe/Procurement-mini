import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TenderService } from './tender.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enum/userRole..enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { TenderFilterDto } from './dto/tender-filter.dto';
@Controller('tender')
@ApiTags('Tenders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenderController {
  constructor(private readonly tenderService: TenderService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body() createTenderDto: CreateTenderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tenderService.create(createTenderDto, user);
  }

  @Get()
  async findAll() {
    return await this.tenderService.findAll();
  }
  @Get('all')
  findAllByFilter(@Query() filter: TenderFilterDto) {
    return this.tenderService.findAllByFilter(filter);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tenderService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateTenderDto: UpdateTenderDto,
  ) {
    return await this.tenderService.update(+id, updateTenderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.tenderService.remove(+id);
  }
}
