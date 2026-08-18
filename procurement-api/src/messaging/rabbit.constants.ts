export const RABBITMQ_SERVICE = 'RABBITMQ_SERVICE';

export const getRabbitMqUrl = () =>
  process.env.RABBITMQ_URL ??
  'amqp://procurement:procurement_password@localhost:5672/procurement';

export const RABBITMQ_QUEUE = 'procurement_notifications';

export const BID_SUBMITTED_EVENT = 'bid.submitted';

export const BID_STATUS_UPDATED_EVENT = 'bid.status.updated';
