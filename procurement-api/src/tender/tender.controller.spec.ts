import { Test, TestingModule } from '@nestjs/testing';
import { TenderController } from './tender.controller';
import { TenderService } from './tender.service';
import { JwtService } from '@nestjs/jwt';

describe('TenderController', () => {
  let controller: TenderController;

  const mockTenderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByFilter: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderController],
      providers: [
        { provide: TenderService, useValue: mockTenderService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TenderController>(TenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
