import * as bcrypt from 'bcrypt';
import { VALIDATION } from '@/env';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { signSession } from '@/utils/cookie';
import { SessionsDB } from './sessions.db';
import { UsersDB } from '../users/users.db';




@Injectable()
export class AuthService {
  constructor(
    private usersDB: UsersDB,
    private sessionsDB: SessionsDB,
  ) { }

  async postLogin(email: string, password: string): Promise<string> {
    const user = await this.usersDB.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(VALIDATION.EMAILPASSERROR);
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException(VALIDATION.EMAILPASSERROR);
    }

    if (!user.isConfirmed) {
      throw new ForbiddenException(VALIDATION.LOGINFAIL);
    }

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = await this.sessionsDB.createSession({
      userId: user.id,
      expiresAt,
    });

    const token = signSession(session.id);

    return token;
  }
}