import { Test, TestingModule } from '@nestjs/testing';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { JwtService } from '@nestjs/jwt';

describe('VendorController', () => {
  let controller: VendorController;
  const vendorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorController],
      providers: [
        { provide: VendorService, useValue: vendorService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<VendorController>(VendorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
