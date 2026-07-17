import { UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { VALIDATION } from '@/env';
import { verifySignedSession } from '@/utils/cookie';
import { SessionsDB } from '@/services/auth/sessions.db';
import { UsersDB } from '@/services/users/users.db';
import { JoinPageDTO, EditPageDTO } from '@/dtos/pages-ws.dto';
import { WsDataException } from '@/utils/ws-data.exception';
import { WsExceptionFilter } from '@/utils/ws-exception.filter';
import { DocsDB } from './docs.db';
import { PagesDB } from './pages.db';



// Расширяем интерфейс Socket для хранения контекста авторизации
interface AuthenticatedSocket extends Socket {
  userId?: string;
  currentDocId?: string;
  currentPageId?: string;
}


const pageRoom = (docId: string, pageId: string) => `doc:${docId}:page:${pageId}`;


@UseFilters(WsExceptionFilter)
@WebSocketGateway({ namespace: '/ws/docs/', cors: { origin: true, credentials: true } })
export class PagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly sessionsDB: SessionsDB,
    private readonly usersDB: UsersDB,
    private readonly docsDB: DocsDB,
    private readonly pagesDB: PagesDB,
  ) { }

  // ==========================================
  // ПОТОК 1: ПОЛУЧЕНИЕ ДАННЫХ (Join & Validate)
  // ==========================================
  @SubscribeMessage('page:join')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
  async joinPage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: JoinPageDTO,
  ): Promise<void> {
    // 1. Валидация сессии
    const sessionId = verifySignedSession(body.sessionToken);
    const session = await this.sessionsDB.findOneById(sessionId ?? '');

    if (!session) {
      throw new WsDataException(VALIDATION.SESSIONNOTFOUND);
    }

    if (session.expiresAt <= new Date()) {
      await this.sessionsDB.deleteSession(session.id);
      throw new WsDataException(VALIDATION.TOKENEXPIRED);
    }

    const user = await this.usersDB.findOneById(session.userId);
    if (!user) {
      throw new WsDataException(VALIDATION.SESSIONNOTFOUND);
    }

    // 2. Проверка документа и прав автора
    const doc = await this.docsDB.findOneById(body.docId, {
      relations: { author: true, pages: true },
    });

    if (!doc || doc.author.id !== user.id) {
      throw new WsDataException(VALIDATION.NOPERMISSION);
    }

    // 3. Проверка существования страницы внутри документа
    const page = doc.pages.find((p) => p.id === body.pageId);
    if (!page) {
      throw new WsDataException(VALIDATION.NOPERMISSION);
    }

    // 4. ✅ СОХРАНЯЕМ КОНТЕКСТ В СОКЕТ
    // Теперь мы знаем, что этот конкретный сокет имеет право работать с этой страницей
    client.userId = user.id;
    client.currentDocId = body.docId;
    client.currentPageId = body.pageId;

    // 5. Подключаем сокет к комнате для будущих рассилок
    const room = pageRoom(body.docId, body.pageId);
    client.join(room);

    // 6. Отправляем данные обратно КОНКРЕТНО этому клиенту
    client.emit('page:data', {
      id: page.id,
      title: page.title,
      content: page.content,
    });
  }

  // ==========================================
  // ПОТОК 2: ОТПРАВКА ДАННЫХ (Edit & Broadcast)
  // ==========================================
  @SubscribeMessage('page:edit')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async editPage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: EditPageDTO, // Приходят ТОЛЬКО title и content
  ): Promise<void> {
    // 1. Проверяем, что клиент прошел валидацию через page:join
    if (!client.currentDocId || !client.currentPageId) {
      throw new WsDataException('Сначала необходимо выполнить page:join');
    }

    // 2. Обновляем данные в БД (без тяжелых запросов с relations и проверок прав)
    await this.pagesDB.edit(client.currentDocId, client.currentPageId, {
      title: body.title,
      content: body.content as any,
    });

    // 3. Рассылка обновленных данных ВСЕМ в этой комнате (включая инициатора)
    const room = pageRoom(client.currentDocId, client.currentPageId);

    this.server.to(room).emit('page:updated', {
      title: body.title,
      content: body.content,
    });

    // Метод возвращает void. Успех подтверждается фактом отсутствия ошибки 
    // и получением события 'page:updated' от сервера.
  }
}