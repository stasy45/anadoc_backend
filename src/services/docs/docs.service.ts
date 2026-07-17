import { Injectable } from '@nestjs/common';
import { DocPageId, DocsDTO, DocsNameDTO, DocsQueryDTO } from '@/dtos/docs.dto';
import { DocsDB } from './docs.db';
import { PagesDB } from './pages.db';




@Injectable()
export class DocsService {
  constructor(
    private docsDB: DocsDB,
    private pagesDB: PagesDB,
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
    await this.docsDB.editById(authorId, id, body);
  }

  async postDoc(
    authorId: string,
  ): Promise<DocPageId> {
    const doc = await this.docsDB.create(authorId, null);

    return {
      docId: doc.id
    }
  }

  async getDocInfo(
    docId: string,
  ): Promise<DocsDTO> {
    return await this.docsDB.findOneById(docId, { relations: { pages: true } });
  }

  async postPage(
    docId: string,
  ): Promise<DocPageId> {
    const page = await this.pagesDB.create(docId, null);

    return {
      pageId: page.id
    }
  }

  async deletePage(docId: string, id: string): Promise<void> {
    return await this.pagesDB.deleteById(docId, id)
  }
}