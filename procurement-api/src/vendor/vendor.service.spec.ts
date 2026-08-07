/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { UserRole } from '../user/enum/userRole..enum';
import type { JwtPayload } from '../auth/decorators/types';

const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    vendor: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
};

jest.mock('../database/db', () => ({ db: mockDb }));

const adminUser: JwtPayload = {
  uid: 1,
  role: UserRole.ADMIN,
  email: 'admin@test.com',
};
const vendorUser: JwtPayload = {
  uid: 2,
  role: UserRole.VENDOR,
  email: 'vendor@test.com',
};

describe('VendorService', () => {
  let service: VendorService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorService],
    }).compile();
    service = module.get<VendorService>(VendorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      name: 'Acme',
      email: 'acme@test.com',
      registrationNumber: '123456789',
    };

    it('throws ConflictException if email already exists', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      });

      await expect(
        service.create(dto as any, adminUser),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws ConflictException if registration number already exists', async () => {
      mockDb.select
        .mockReturnValueOnce({
          from: jest
            .fn()
            .mockReturnValue({
              where: jest
                .fn()
                .mockReturnValue({ execute: jest.fn().mockResolvedValue([]) }),
            }),
        })
        .mockReturnValueOnce({
          from: jest
            .fn()
            .mockReturnValue({
              where: jest
                .fn()
                .mockReturnValue({
                  execute: jest.fn().mockResolvedValue([{ id: 1 }]),
                }),
            }),
        });

      await expect(
        service.create(dto as any, adminUser),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates a vendor successfully', async () => {
      const newVendor = { id: 1, ...dto, ownerId: adminUser.uid };
      mockDb.select.mockReturnValue({
        from: jest
          .fn()
          .mockReturnValue({
            where: jest
              .fn()
              .mockReturnValue({ execute: jest.fn().mockResolvedValue([]) }),
          }),
      });
      mockDb.insert.mockReturnValue({
        values: jest
          .fn()
          .mockReturnValue({
            returning: jest
              .fn()
              .mockReturnValue({
                execute: jest.fn().mockResolvedValue([newVendor]),
              }),
          }),
      });

      const result = await service.create(dto as any, adminUser);
      expect(result).toEqual(newVendor);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException if vendor does not exist', async () => {
      mockDb.query.vendor.findFirst.mockResolvedValue(null);
      await expect(service.findOne(99, adminUser)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws ForbiddenException if non-admin views another vendor', async () => {
      mockDb.query.vendor.findFirst.mockResolvedValue({ id: 1, ownerId: 99 });
      await expect(service.findOne(1, vendorUser)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('returns vendor for owner', async () => {
      const existingVendor = { id: 1, ownerId: vendorUser.uid };
      mockDb.query.vendor.findFirst.mockResolvedValue(existingVendor);
      const result = await service.findOne(1, vendorUser);
      expect(result).toEqual(existingVendor);
    });
  });
});
