import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from 'express';


@Catch(HttpException)
export class ErrorBoundaryFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    response
      .status(exception.getStatus())
      .json(exception.getResponse());
  }
}