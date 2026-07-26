import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from '../database/db';
import { vendor } from '../database/schema/vendor.schema';
import { JwtPayload } from '../auth/decorators/current-user.decorator';

@Injectable()
export class VendorService {
  constructor() {}
  async create(createVendorDto: CreateVendorDto, user: JwtPayload) {
    const existingVendor = await db
      .select()
      .from(vendor)
      .where(eq(vendor.registrationNumber, createVendorDto.registrationNumber))
      .execute();
    if (existingVendor) {
      throw new ConflictException(
        'Vendor with this registration number already exists',
      );
    }
    const userOwneVendor = await db
      .select()
      .from(vendor)
      .where(eq(vendor.ownerId, user.uid))
      .execute();
    if (userOwneVendor.length > 0) {
      throw new ConflictException(
        'You already own a vendor. Each user can only register one vendor.',
      );
    }
    const newVendor = await db
      .insert(vendor)
      .values(createVendorDto)
      .returning()
      .execute();
    return newVendor;
  }

  async findAll() {
    return await db.select().from(vendor).execute();
  }
  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const existingVendor = await db
      .select()
      .from(vendor)
      .where(eq(vendor.id, id as any as number))
      .execute();
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return existingVendor;
  }
}
