import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/enum/userRole..enum';
import { Roles } from '../auth/decorators/roles.decorator';
@ApiTags('Bid')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @ApiProperty({ example: 'Create a new bid' })
  @ApiTags('Bid')
  create(@Body() createBidDto: CreateBidDto, @CurrentUser() user: JwtPayload) {
    return this.bidService.create(createBidDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.bidService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: number) {
    return this.bidService.findOne(id);
  }

  @Get('vendor/:vendorId')
  findByVendorId(@Param('vendorId') vendorId: number) {
    return this.bidService.findByVendorId(vendorId);
  }

  @Get('tender/:tenderId')
  @Roles(UserRole.ADMIN)
  findByTenderId(@Param('tenderId') tenderId: number) {
    return this.bidService.findByTenderId(tenderId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBidDto: UpdateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidService.update(+id, updateBidDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.bidService.remove(+id, user);
  }
}
