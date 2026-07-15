import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { VALIDATION } from '@/env';
import { UsersDB } from '@/services/users/users.db';
import { SessionsDB } from '@/services/auth/sessions.db';
import { verifySignedSession } from '@/utils/cookie';
import { IS_PUBLIC_KEY } from './public.decorator';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersDB: UsersDB,
    private readonly sessionsDB: SessionsDB,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (isPublic) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<Request>();

    const sessionToken = request.cookies?.sessionToken;

    if (!sessionToken) {
      throw new UnauthorizedException(VALIDATION.DATAERROR);
    }

    const id = verifySignedSession(sessionToken)

    const session =
      await this.sessionsDB.findOneById(id);

    if (!session) {
      throw new NotFoundException(VALIDATION.SESSIONNOTFOUND);
    }

    const now = new Date();

    if (session.expiresAt <= now) {
      await this.sessionsDB.deleteSession(session.id);
      throw new UnauthorizedException(VALIDATION.TOKENEXPIRED);
    }

    const user = await this.usersDB.findOneById(
      session.userId,
    );

    if (!user) {
      throw new UnauthorizedException(VALIDATION.USERNOTFOUND);
    }

    request.user = user;

    return true;
  }
}