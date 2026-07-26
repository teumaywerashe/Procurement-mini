import { Module } from '@nestjs/common';
import { TenderService } from './tender.service';
import { TenderController } from './tender.controller';

@Module({
  controllers: [TenderController],
  providers: [TenderService],
})
export class TenderModule {}
