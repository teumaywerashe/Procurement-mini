import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { User } from './user/entities/user.entity';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
// import { Vendor } from './vendor/entities/vendor.entity';
import { TenderModule } from './tender/tender.module';
import { BidModule } from './bid/bid.module';
dotenv.config({ path: '../.env' });

@Module({
  imports: [AuthModule, UserModule, VendorModule, TenderModule, BidModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
