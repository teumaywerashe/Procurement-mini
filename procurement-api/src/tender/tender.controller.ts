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
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenderFilterDto } from './dto/tender-filter.dto';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/decorators/types';
import { UserRole } from '../user/enum/userRole.enum';

@Controller('tender')
@ApiTags('Tenders')
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
  findAll(@Query() filter: TenderFilterDto, @CurrentUser() user: JwtPayload) {
    return this.tenderService.findAllByFilter(filter, user);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tenderService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateTenderDto: UpdateTenderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tenderService.update(+id, updateTenderDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.tenderService.remove(+id, user);
  }
}
