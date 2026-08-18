import { Test, TestingModule } from '@nestjs/testing';
import { NotifiactionController } from './notifiaction.controller';
import { NotifiactionService } from './notifiaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('NotifiactionController', () => {
  let controller: NotifiactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifiactionController],
      providers: [
        NotifiactionService,
        JwtAuthGuard,
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<NotifiactionController>(NotifiactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
