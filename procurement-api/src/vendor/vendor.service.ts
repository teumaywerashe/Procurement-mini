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
import { JwtPayload } from '../auth/decorators/types';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor() {}
  async create(createVendorDto: CreateVendorDto, user: JwtPayload) {
    const [existingVendorWithEmail] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.email, createVendorDto.email as any as string))
      .execute();

    if (existingVendorWithEmail) {
      throw new ConflictException('Email already exists');
    }
    const [existingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.registrationNumber, createVendorDto.registrationNumber))
      .execute();
    if (existingVendor) {
      throw new ConflictException(
        'Vendor with this registration number already exists',
      );
    }
    const [userOwneVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.ownerId, user.uid))
      .execute();
    console.log(userOwneVendor);
    if (userOwneVendor) {
      throw new ConflictException(
        'You already own a vendor. Each user can only register one vendor.',
      );
    }
    const [newVendor] = await db
      .insert(vendor)
      .values({ ...createVendorDto, ownerId: user.uid })
      .returning()
      .execute();

    return newVendor;
  }

  async findAll() {
    return await db.query.vendor.findMany({
      with: {
        bids: true,
        user: true,
      },
    });
  }
  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const existingVendor = await db.query.vendor.findFirst({
      where: { id },
      with: {
        bids: true,
        user: true,
      },
    });
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return existingVendor;
  }
  async findByOwnerId(ownerId: number) {
    if (!ownerId) {
      throw new BadRequestException('Owner ID is required');
    }
    const existingVendor = await db.query.vendor.findFirst({
      where: { ownerId },
      with: {
        bids: true,
        user: true,
      },
    });
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found for this owner');
    }
    return existingVendor;
  }

  async updateVendor(id: string, updateVendorDto: UpdateVendorDto) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const [existingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.id, id as any as number))
      .execute();
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    const [updatedVendor] = await db
      .update(vendor)
      .set(updateVendorDto as any as Partial<typeof vendor>)
      .where(eq(vendor.id, id as any as number))
      .returning()
      .execute();
    return updatedVendor;
  }
  async deleteVendor(id: number) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const [existingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.id, id))
      .execute();
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    const [deletedVendor] = await db
      .delete(vendor)
      .where(eq(vendor.id, id))
      .returning()
      .execute();
    return {
      deletedVendor: deletedVendor,
      success: true,
      message: 'Vendor deleted successfully',
    };
  }
}
