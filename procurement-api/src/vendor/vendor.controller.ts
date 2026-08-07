import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/types';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enum/userRole.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CollectionQueryDto } from '../common/dto/collection-query.dto';

@Controller('vendor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new vendor' })
  create(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vendorService.create(createVendorDto, user);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get all vendors with pagination/search (super admin only)',
  })
  findAll(@Query() query: CollectionQueryDto) {
    return this.vendorService.findAll(query);
  }

  @Get('owner/me')
  @ApiOperation({ summary: 'Get the logged-in vendor profile' })
  findByOwnerId(@CurrentUser() user: JwtPayload) {
    return this.vendorService.findByOwnerId(user.uid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vendor by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.vendorService.findOne(+id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vendor (owner or super admin)' })
  updateVendor(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vendorService.updateVendor(+id, updateVendorDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a vendor (super_admin only)' })
  deleteVendor(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.vendorService.deleteVendor(+id, user);
  }
}
