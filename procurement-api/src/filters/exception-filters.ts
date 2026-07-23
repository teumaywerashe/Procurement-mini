import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchEverythingFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus >= 500) {
      this.logger.error(exception);
    }

    const request = ctx.getRequest<Request>();
    const path = httpAdapter.getRequestUrl(request) as string;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      error:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      method: request.method,
      path,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
