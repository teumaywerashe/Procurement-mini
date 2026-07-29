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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/enum/userRole..enum';
import { Roles } from '../auth/decorators/roles.decorator';
@ApiTags('Bid')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bid' })
  create(@Body() createBidDto: CreateBidDto, @CurrentUser() user: JwtPayload) {
    return this.bidService.create(createBidDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bids (admin only)' })
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.bidService.findAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get bids for the logged-in vendor' })
  findByVendor(@CurrentUser() user: JwtPayload) {
    return this.bidService.findByVendorId(user.uid);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a bid by ID' })
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: number) {
    return this.bidService.findOne(id);
  }

  @Get('tender/:tenderId')
  @ApiOperation({ summary: 'Get bids by tender ID (admin only)' })
  @Roles(UserRole.ADMIN)
  findByTenderId(@Param('tenderId') tenderId: number) {
    return this.bidService.findByTenderId(tenderId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bid by ID (Bid Owner only)' })
  update(
    @Param('id') id: number,
    @Body() updateBidDto: UpdateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidService.update(+id, updateBidDto, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update bid status by ID (Admin only)' })
  @Roles(UserRole.ADMIN)
  updateBidStatus(@Param('id') id: number, @Body('status') status: string) {
    const updateBidDto = new UpdateBidDto();
    updateBidDto.bidStatus = status as 'pending' | 'accepted' | 'rejected';
    return this.bidService.update(+id, updateBidDto, {
      uid: 0,
      email: '',
      role: UserRole.ADMIN,
    });
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bid by ID (Bid Owner only)' })
  remove(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.bidService.remove(+id, user);
  }
}
