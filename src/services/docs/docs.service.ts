import { ConflictException, Injectable } from '@nestjs/common';
import { VALIDATION } from '@/env';
import { DocsDTO, DocsNameDTO, DocsQueryDTO } from '@/dtos/docs.dto';
import { DocsDB } from './docs.db';




@Injectable()
export class DocsService {
  constructor(
    private docsDB: DocsDB,
  ) { }

  async getDocs(authorId: string, query: DocsQueryDTO): Promise<DocsDTO[]> {
    return await this.docsDB.findBySearchLine(authorId, query.searchLine)
  }

  async deleteAllDocs(authorId: string): Promise<void> {
    return await this.docsDB.deleteByAuthorId(authorId)
  }

  async deleteDoc(authorId: string, id: string): Promise<void> {
    return await this.docsDB.deleteById(authorId, id)
  }

  async patchDocName(
    authorId: string,
    id: string,
    body: DocsNameDTO,
  ): Promise<void> {
    const exists = await this.docsDB.existsByAuthorName(authorId, body.name)

    if (exists) {
      throw new ConflictException(VALIDATION.DOCALREADYEXIST);
    }

    await this.docsDB.editById(authorId, id, body);
  }
}