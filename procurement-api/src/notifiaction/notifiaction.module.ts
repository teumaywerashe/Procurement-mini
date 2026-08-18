import { Module } from '@nestjs/common';
import { NotifiactionService } from './notifiaction.service';
import { NotifiactionController } from './notifiaction.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [NotifiactionController],
  providers: [NotifiactionService],
  exports: [NotifiactionService],
})
export class NotifiactionModule {}
