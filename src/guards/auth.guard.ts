import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { VALIDATION } from '@/env';
import { UsersDB } from '@/services/users/users.db';
import { verifySignedUserId } from '@/utils/cookie';
import { IS_PUBLIC_KEY } from './public.decorator';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersDB: UsersDB,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const signedUserId = request.cookies?.userId;
    const userId = verifySignedUserId(signedUserId);

    console.log('signedUserId', signedUserId);
    console.log('userId', userId);
    if (!signedUserId || !userId) {
      throw new UnauthorizedException(VALIDATION.TOKEN);
    }

    const user = await this.usersDB.findOneById(userId);

    if (!user) {
      throw new UnauthorizedException(VALIDATION.USERNOTFOUND);
    }

    request.user = user;

    return true;
  }
}