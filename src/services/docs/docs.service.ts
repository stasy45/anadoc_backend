import { Injectable } from '@nestjs/common';
import { DocsDB } from './docs.db';




@Injectable()
export class DocsService {
  constructor(
    private docsDB: DocsDB,
  ) { }

}