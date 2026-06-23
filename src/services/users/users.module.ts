import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/users/users.entity';
import { UsersDB } from './users.db';
import { UsersController } from './users.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersDB],
  exports: [TypeOrmModule, UsersDB],
})
export class UsersModule { }