import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { TenderModule } from './tender/tender.module';
import { BidModule } from './bid/bid.module';

@Module({
  imports: [UserModule, VendorModule, TenderModule, BidModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
