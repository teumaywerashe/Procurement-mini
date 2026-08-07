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
import { UserRole } from '../user/enum/userRole..enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenderFilterDto } from './dto/tender-filter.dto';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/decorators/types';

@Controller('tender')
@ApiTags('Tenders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenderController {
  constructor(private readonly tenderService: TenderService) {}

  /** Admin only: create a tender linked to their account */
  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body() createTenderDto: CreateTenderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tenderService.create(createTenderDto, user);
  }

  /**
   * Admins get their own tenders + bids.
   * Vendors get all tenders (no bids).
   */
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.tenderService.findAll(user);
  }

  /**
   * Same scoping as findAll but with filters.
   * Vendors can use this to browse/search all tenders.
   */
  @Get('all')
  findAllByFilter(
    @Query() filter: TenderFilterDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tenderService.findAllByFilter(filter, user);
  }

  /** Public: anyone can view a single tender */
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tenderService.findOne(+id);
  }

  /** Admin only: update own tender */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateTenderDto: UpdateTenderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tenderService.update(+id, updateTenderDto, user);
  }

  /** Admin only: delete own tender */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.tenderService.remove(+id, user);
  }
}
