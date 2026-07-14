import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Docs } from '@/entities/docs/docs.entity';
import { Pages } from '@/entities/docs/pages.entity';
import { DocsController } from './docs.controller';
import { DocsDB } from './docs.db';
import { PagesDB } from './pages.db';
import { DocsService } from './docs.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([Docs]),
    TypeOrmModule.forFeature([Pages]),
  ],
  controllers: [DocsController],
  providers: [DocsService, DocsDB, PagesDB],
  exports: [DocsDB, PagesDB]
})
export class DocsModule { }