/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  RABBITMQ_SERVICE,
  BID_SUBMITTED_EVENT,
  BID_STATUS_UPDATED_EVENT,
} from './rabbit.constants';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  constructor(
    @Inject(RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();

    console.log('RabbitMQ connected successfully');
  }

  async publishBidSubmitted(data: unknown) {
    await this.client.emit(BID_SUBMITTED_EVENT, data).toPromise();
  }

  async publishBidStatusUpdated(data: unknown) {
    await this.client.emit(BID_STATUS_UPDATED_EVENT, data).toPromise();
  }
}
