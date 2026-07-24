import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Vendor } from './entities/vendor.entity';

describe('VendorService', () => {
  let service: VendorService;
  const vendorRepository = {
    create: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorService,
        { provide: getRepositoryToken(Vendor), useValue: vendorRepository },
      ],
    }).compile();

    service = module.get<VendorService>(VendorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects a duplicate registration number', async () => {
    vendorRepository.findOneBy.mockResolvedValue({ id: 'vendor-id' });

    await expect(
      service.create({ name: 'Acme', registrationNumber: '123456789' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
