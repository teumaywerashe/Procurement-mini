import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],

  exports: [UserService],
})
export class UserModule {}
