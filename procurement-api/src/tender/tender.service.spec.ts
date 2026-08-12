import { Test, TestingModule } from '@nestjs/testing';
import { TenderService } from './tender.service';

jest.mock('../database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      tender: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  },
}));

describe('TenderService', () => {
  let service: TenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderService],
    }).compile();

    service = module.get<TenderService>(TenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
