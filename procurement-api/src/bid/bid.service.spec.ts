import { Test, TestingModule } from '@nestjs/testing';
import { BidService } from './bid.service';
import { RabbitMQService } from '../messaging/messaging.service';

describe('BidService', () => {
  let service: BidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidService,
        {
          provide: RabbitMQService,
          useValue: {
            publishBidSubmitted: jest.fn(),
            publishBidStatusUpdated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BidService>(BidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
