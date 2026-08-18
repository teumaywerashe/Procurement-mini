import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { TenderModule } from './tender/tender.module';
import { BidModule } from './bid/bid.module';
import { NotifiactionModule } from './notifiaction/notifiaction.module';
import { MessagingModule } from './messaging/messaging.module';
import { MinioModule } from './minio/minio.module';
import { DocumentModule } from './document/document.module';
dotenv.config({ path: '../.env' });

@Module({
  imports: [
    AuthModule,
    UserModule,
    VendorModule,
    TenderModule,
    BidModule,
    NotifiactionModule,
    MessagingModule,
    MinioModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
