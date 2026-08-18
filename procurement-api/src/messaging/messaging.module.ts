/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RABBITMQ_SERVICE, RABBITMQ_QUEUE } from './rabbit.constants';

import { RabbitMQService } from './messaging.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RABBITMQ_SERVICE,

        transport: Transport.RMQ,

        options: {
          urls: [process.env.RABBITMQ_URL!],

          queue: RABBITMQ_QUEUE,

          queueOptions: {
            durable: true,
          },

          persistent: true,

          noAck: false,
        },
      },
    ]),
  ],

  providers: [RabbitMQService],

  exports: [RabbitMQService],
})
export class MessagingModule {}
