import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enum/userRole..enum';
@Controller('vendor')
@UseGuards(JwtAuthGuard)
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
  @ApiOperation({ summary: 'Get a vendor by ID' })
  async findOne(@Param('id') id: string) {
    return await this.vendorService.findOne(id);
  }
}
