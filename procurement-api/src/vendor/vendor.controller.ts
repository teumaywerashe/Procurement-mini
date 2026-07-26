import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enum/userRole..enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOrOwnerGuard } from '../auth/guards/adminOrOwner.guard';
import { AdminOrOwner } from '../auth/decorators/adminOrOwner.decorator';
import { UpdateVendorDto } from './dto/update-vendor.dto';
@Controller('vendor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, AdminOrOwnerGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}
  @Post('register')
  @ApiOperation({ summary: 'Create a new vendor' })
  create(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vendorService.create(createVendorDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vendors' })
  async findAll() {
    return await this.vendorService.findAll();
  }
  @Get(':id')
  @AdminOrOwner()
  @ApiOperation({ summary: 'Get a vendor by ID' })
  async findOne(@Param('id') id: number) {
    return await this.vendorService.findOne(id);
  }
  @Get('owner/me')
  // @AdminOrOwner()
  @ApiOperation({ summary: 'Get logged-in vendor' })
  async findByOwnerId(@CurrentUser() user: JwtPayload) {
    return await this.vendorService.findByOwnerId(user.uid);
  }
  @Patch(':id')
  @AdminOrOwner()
  @ApiOperation({ summary: 'Update a vendor by ID' })
  async updateVendor(id: string, updateVendorDto: UpdateVendorDto) {
    return await this.vendorService.updateVendor(id, updateVendorDto);
  }

  @Delete(':id')
  @AdminOrOwner()
  @ApiOperation({ summary: 'Delete a vendor by ID' })
  async deleteVendor(@Param('id') id: number) {
    return await this.vendorService.deleteVendor(id);
  }
}
