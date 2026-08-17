import { Module } from '@nestjs/common';
import { NotifiactionService } from './notifiaction.service';
import { NotifiactionController } from './notifiaction.controller';

@Module({
  controllers: [NotifiactionController],
  providers: [NotifiactionService],
})
export class NotifiactionModule {}
