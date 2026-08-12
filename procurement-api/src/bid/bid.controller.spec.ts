import { Test, TestingModule } from '@nestjs/testing';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { JwtService } from '@nestjs/jwt';

describe('BidController', () => {
  let controller: BidController;

  const mockBidService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByTender: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidController],
      providers: [
        { provide: BidService, useValue: mockBidService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<BidController>(BidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
