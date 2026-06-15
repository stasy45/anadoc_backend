import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from '@/entities/users/sessions.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionsDB } from './sessions.db';
import { UsersModule } from '../users/users.module';



@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionsDB],
  exports: [SessionsDB]
})
export class AuthModule { }