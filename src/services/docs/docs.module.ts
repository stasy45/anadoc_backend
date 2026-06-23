import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Docs } from '@/entities/docs/docs.entity';
import { DocsController } from './docs.controller';
import { DocsDB } from './docs.db';
import { DocsService } from './docs.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([Docs]),
  ],
  controllers: [DocsController],
  providers: [DocsService, DocsDB],
  exports: [DocsDB]
})
export class DocsModule { }