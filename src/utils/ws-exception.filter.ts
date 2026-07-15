import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { VALIDATION } from '@/env';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>();

    let message: string = VALIDATION.DATAERROR;

    if (exception instanceof WsException) {
      const error = exception.getError();
      message =
        typeof error === 'string'
          ? error
          : ((error as any)?.message ?? message);
    } else {
      const response = (exception as any)?.response;
      const responseMessage = response?.message;

      message = Array.isArray(responseMessage)
        ? responseMessage[0]
        : (responseMessage ?? (exception as any)?.message ?? message);
    }

    client.emit('error', { message });
  }
}