import { Test, TestingModule } from '@nestjs/testing';
import { NotifiactionService } from './notifiaction.service';

describe('NotifiactionService', () => {
  let service: NotifiactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifiactionService],
    }).compile();

    service = module.get<NotifiactionService>(NotifiactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
