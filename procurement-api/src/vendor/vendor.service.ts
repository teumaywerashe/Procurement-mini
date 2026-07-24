import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm/repository/Repository.js';

import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { LoginVendorDto } from './dto/login-vendor';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}
  async create(createVendorDto: CreateVendorDto) {
    const existingVendor = await this.vendorRepository.findOneBy({
      registrationNumber: createVendorDto.registrationNumber,
    });
    if (existingVendor) {
      throw new ConflictException(
        'Vendor with this registration number already exists',
      );
    }
    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }
  async login(loginVendorDto: LoginVendorDto) {
    const vendor = await this.vendorRepository.findOneBy({
      registrationNumber: loginVendorDto.registrationNumber,
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }
  async findAll() {
    return await this.vendorRepository.find();
  }
  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const vender = await this.vendorRepository.findOneBy({ id });
    if (!vender) {
      throw new NotFoundException('Vendor not found');
    }
    return vender;
  }
}
