import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchEverythingFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    console.log('adaptor', httpAdapter);
    const ctx = host.switchToHttp();
    console.log('Exception caught by CatchEverythingFilter:', exception);
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus >= 500) {
      this.logger.error(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error',
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
