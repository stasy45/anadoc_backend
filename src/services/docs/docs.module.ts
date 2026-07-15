import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Docs } from '@/entities/docs/docs.entity';
import { Pages } from '@/entities/docs/pages.entity';
import { DocsController } from './docs.controller';
import { DocsDB } from './docs.db';
import { PagesDB } from './pages.db';
import { DocsService } from './docs.service';
import { PagesGateway } from './pages.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Docs]),
    TypeOrmModule.forFeature([Pages]),
    AuthModule,
    UsersModule
  ],
  controllers: [DocsController],
  providers: [DocsService, DocsDB, PagesDB, PagesGateway],
  exports: [DocsDB, PagesDB]
})
export class DocsModule { }