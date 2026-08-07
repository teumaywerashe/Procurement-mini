/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { asc, count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../database/db';
import { vendor } from '../database/schema/vendor.schema';
import { JwtPayload } from '../auth/decorators/types';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UserRole } from '../user/enum/userRole.enum';
import { CollectionQueryDto } from '../common/dto/collection-query.dto';
import type { CollectionResult } from '../common/dto/collection-result';

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
    // console.log(userOwneVendor);
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

  async findAll(query: CollectionQueryDto): Promise<CollectionResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const SORTABLE: Record<string, any> = {
      createdAt: vendor.createdAt,
      name: vendor.name,
      email: vendor.email,
    };
    const sortCol = SORTABLE[query.sortBy ?? 'createdAt'] ?? vendor.createdAt;
    const orderFn = (query.sortDir ?? 'desc') === 'asc' ? asc : desc;

    // Build base query
    let base = db.select().from(vendor).$dynamic();
    if (query.q) {
      base = base.where(
        or(
          ilike(vendor.name, `%${query.q}%`),
          ilike(vendor.email, `%${query.q}%`),
        ),
      );
    }

    // Count
    const countQuery = db.select({ value: count() }).from(vendor);
    if (query.q) {
      countQuery.where(
        or(
          ilike(vendor.name, `%${query.q}%`),
          ilike(vendor.email, `%${query.q}%`),
        ),
      );
    }
    const [{ value: total }] = await countQuery;

    // Rows
    const rows = await base
      .orderBy(orderFn(sortCol))
      .limit(limit)
      .offset(offset);
    const ids = rows.map((r) => r.id);

    if (ids.length === 0)
      return { data: [], total: Number(total), page, limit };

    // Fetch with relations for returned IDs only
    const data = await db.query.vendor.findMany({
      where: { id: { in: ids } },
      with: { bids: true, user: true },
    });

    // Re-order to match sorted order
    const ordered = ids.map((id) => data.find((v) => v.id === id)!);

    return { data: ordered, total: Number(total), page, limit };
  }
  async findOne(id: number, user: JwtPayload) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const existingVendor = await db.query.vendor.findFirst({
      where: { id },
      with: { bids: true, user: true },
    });
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    // Vendors can only view their own profile; super admin can view any
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      existingVendor.ownerId !== user.uid
    ) {
      throw new ForbiddenException('You can only view your own vendor profile');
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

  async updateVendor(
    id: number,
    updateVendorDto: UpdateVendorDto,
    user: JwtPayload,
  ) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const existingVendor = await db.query.vendor.findFirst({ where: { id } });
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      existingVendor.ownerId !== user.uid
    ) {
      throw new ForbiddenException(
        'You can only update your own vendor profile',
      );
    }
    const [updatedVendor] = await db
      .update(vendor)
      .set(updateVendorDto as any as Partial<typeof vendor>)
      .where(eq(vendor.id, id))
      .returning()
      .execute();
    return updatedVendor;
  }
  async deleteVendor(id: number, user: JwtPayload) {
    if (!id) {
      throw new BadRequestException('Vendor ID is required');
    }
    const existingVendor = await db.query.vendor.findFirst({ where: { id } });
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      existingVendor.ownerId !== user.uid
    ) {
      throw new ForbiddenException(
        'You can only delete your own vendor profile',
      );
    }
    const [deletedVendor] = await db
      .delete(vendor)
      .where(eq(vendor.id, id))
      .returning()
      .execute();
    return {
      deletedVendor,
      success: true,
      message: 'Vendor deleted successfully',
    };
  }
}
