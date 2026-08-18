import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MinioModule } from '../minio/minio.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MinioModule, AuthModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
