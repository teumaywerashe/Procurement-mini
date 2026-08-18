/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  RABBITMQ_SERVICE,
  RABBITMQ_QUEUE,
  getRabbitMqUrl,
} from './rabbit.constants';

import { RabbitMQService } from './messaging.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RABBITMQ_SERVICE,

        transport: Transport.RMQ,

        options: {
          urls: [getRabbitMqUrl()],

          queue: RABBITMQ_QUEUE,

          queueOptions: {
            durable: true,
          },

          persistent: true,

          // This is a publishing client. Nest's reply consumer must use
          // automatic acknowledgements; the event consumer acks messages
          // separately in the notification controller.
          noAck: true,
        },
      },
    ]),
  ],

  providers: [RabbitMQService],

  exports: [RabbitMQService],
})
export class MessagingModule {}
