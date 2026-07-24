import { ConflictException, Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm/repository/Repository.js';

import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

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
  async findOne(id: string) {
    return await this.vendorRepository.findOneBy({ id });
  }
}
