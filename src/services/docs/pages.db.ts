import { FindOneOptions, Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pages } from '@/entities/docs/pages.entity';




@Injectable()
export class PagesDB {
  constructor(
    @InjectRepository(Pages)
    private pagesRepository: Repository<Pages>,
  ) { }

  async findOneById(id: string, options?: FindOneOptions<Pages>): Promise<Pages | null> {
    if (!id) return null;
    return await this.pagesRepository.findOne({
      where: {
        id,
      },
      ...options
    });
  }

  async create(docId: string, page: Partial<Pages>): Promise<Pages> {
    if (!docId) return;

    return await this.pagesRepository.save({
      doc: {
        id: docId,
      },
      ...page
    });
  }

  async deleteById(docId: string, id: string): Promise<void> {
    if (!docId || !id) return;

    await this.pagesRepository.delete({
      id,
      doc: {
        id: docId,
      },
    });
  }

  async edit(docId: string, id: string, page: Partial<Pages>): Promise<void> {
    if (!docId || !id) return;

    await this.pagesRepository.update(
      {
        id,
        doc: {
          id: docId,
        },
      },
      page,
    );
  }
}