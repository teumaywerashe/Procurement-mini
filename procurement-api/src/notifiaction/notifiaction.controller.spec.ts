import { Test, TestingModule } from '@nestjs/testing';
import { NotifiactionController } from './notifiaction.controller';
import { NotifiactionService } from './notifiaction.service';

describe('NotifiactionController', () => {
  let controller: NotifiactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifiactionController],
      providers: [NotifiactionService],
    }).compile();

    controller = module.get<NotifiactionController>(NotifiactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
