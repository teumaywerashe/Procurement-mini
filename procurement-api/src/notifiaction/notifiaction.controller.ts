/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotifiactionService } from './notifiaction.service';
import { CreateNotifiactionDto } from './dto/create-notifiaction.dto';
import { UpdateNotifiactionDto } from './dto/update-notifiaction.dto';
import type { JwtPayload } from '../auth/decorators/types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  BID_STATUS_UPDATED_EVENT,
  BID_SUBMITTED_EVENT,
} from '../messaging/rabbit.constants';
import type {
  BidStatusUpdatedEvent,
  BidSubmittedEvent,
} from '../messaging/messaging.service';
@ApiTags('Notifications')
@Controller('notifiaction')
export class NotifiactionController {
  constructor(private readonly notifiactionService: NotifiactionService) {}

  @EventPattern(BID_SUBMITTED_EVENT)
  async handleBidSubmitted(
    @Payload() event: BidSubmittedEvent,
    @Ctx() context: RmqContext,
  ) {
    try {
      const notification = await this.notifiactionService.create(
        {
          type: 'BID',
          message: event.message,
          tenderId: event.tenderId,
          bidId: event.bidId,
        },
        event.userId,
      );
      context.getChannelRef().ack(context.getMessage());
      return notification;
    } catch (error) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw error;
    }
  }

  @EventPattern(BID_STATUS_UPDATED_EVENT)
  async handleBidStatusUpdated(
    @Payload() event: BidStatusUpdatedEvent,
    @Ctx() context: RmqContext,
  ) {
    try {
      const notification = await this.notifiactionService.create(
        {
          type: 'BID',
          message: event.message,
          tenderId: event.tenderId,
          bidId: event.bidId,
        },
        event.userId,
      );
      context.getChannelRef().ack(context.getMessage());
      return notification;
    } catch (error) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw error;
    }
  }

  @Post()
  create(
    @Body() createNotifiactionDto: CreateNotifiactionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notifiactionService.create(createNotifiactionDto, +user?.uid);
  }

  @Get()
  findAll() {
    return this.notifiactionService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser() user: JwtPayload) {
    return this.notifiactionService.findForUser(+user.uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifiactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotifiactionDto: UpdateNotifiactionDto,
  ) {
    return this.notifiactionService.update(+id, updateNotifiactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifiactionService.remove(+id);
  }
}
