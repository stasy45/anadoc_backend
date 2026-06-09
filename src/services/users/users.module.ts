import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/users/users.entity'; 
import { UsersDB } from './users.db';



@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersDB],
  exports: [TypeOrmModule, UsersDB],
})
export class UsersModule {}