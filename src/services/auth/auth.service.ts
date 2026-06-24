import * as bcrypt from 'bcrypt';
import { VALIDATION } from '@/env';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { signSession } from '@/utils/cookie';
import { LoginDTO, RegistrationDTO } from '@/dtos/auth.dto';
import { SessionsDB } from './sessions.db';
import { UsersDB } from '../users/users.db';




@Injectable()
export class AuthService {
  constructor(
    private usersDB: UsersDB,
    private sessionsDB: SessionsDB,
  ) { }

  async postLogin(body: LoginDTO): Promise<string> {
    const user = await this.usersDB.findOneByEmail(body.email);

    if (!user) {
      throw new NotFoundException(VALIDATION.EMAILPASSERROR);
    }

    const isValidPassword = await bcrypt.compare(
      body.password,
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

  async postRegistration(body: RegistrationDTO): Promise<void> {
    const existingUser =
      await this.usersDB.findOneByEmail(body.email);

    if (existingUser) {
      throw new ConflictException(VALIDATION.REGISTRATIONFAIL);
    }

    const passwordHash = await bcrypt.hash(
      body.password,
      10,
    );

    await this.usersDB.createUser({
      name: body.name,
      email: body.email,
      password: passwordHash,
      isConfirmed: false,
    });
  }
}