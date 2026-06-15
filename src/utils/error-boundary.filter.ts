import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { VALIDATION } from '@/env';



@Catch(HttpException)
export class ErrorBoundaryFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      !Array.isArray(exceptionResponse) &&
      !('message' in exceptionResponse)
    ) {
      response.status(status).json(exceptionResponse);
      return;
    }

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : Array.isArray((exceptionResponse as any)?.message)
          ? (exceptionResponse as any).message[0]
          : (exceptionResponse as any)?.message;

    response.status(status).json({
      message: message ?? VALIDATION.DATAERROR,
    });
  }
}