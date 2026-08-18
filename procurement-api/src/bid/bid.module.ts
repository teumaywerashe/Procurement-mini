import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { AuthModule } from '../auth/auth.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [AuthModule, MessagingModule],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
