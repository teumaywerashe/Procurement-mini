import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vendor by ID' })
  async findOne(@Param('id') id: string) {
    return await this.vendorService.findOne(id);
  }
}
