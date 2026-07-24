import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginVendorDto } from './dto/login-vendor';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}
  @Post('register')
  @ApiOperation({ summary: 'Create a new vendor' })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login as a vendor' })
  login(@Body() loginVendorDto: LoginVendorDto) {
    return this.vendorService.login(loginVendorDto);
  }

  @Get()
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
