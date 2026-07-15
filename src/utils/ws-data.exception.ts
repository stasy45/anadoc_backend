import { WsException } from '@nestjs/websockets';

/** Единообразная ошибка для WS: клиент всегда получает { message } */
export class WsDataException extends WsException {
  constructor(message: string) {
    super({ message });
  }
}