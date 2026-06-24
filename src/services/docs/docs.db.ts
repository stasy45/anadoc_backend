import { FindOneOptions, ILike, In, Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Docs } from '@/entities/docs/docs.entity';




@Injectable()
export class DocsDB {
  constructor(
    @InjectRepository(Docs)
    private docsRepository: Repository<Docs>,
  ) { }

  async findOneById(id: string, options?: FindOneOptions<Docs>): Promise<Docs | null> {
    if (!id) return null;
    return await this.docsRepository.findOne({
      where: {
        id,
      },
      ...options
    });
  }

  async findBySearchLine(authorId: string, searchLine: string): Promise<Docs[]> {
    if (!searchLine?.trim()) return await this.docsRepository.find({
      where: {
        author: {
          id: authorId,
        },
      },
    });;

    return await this.docsRepository.find({
      where: {
        author: {
          id: authorId,
        },
        name: ILike(`%${searchLine}%`),
      },
    });
  }

  async deleteByAuthorId(authorId: string): Promise<void> {
    if (!authorId) return;

    await this.docsRepository.delete({
      author: {
        id: authorId,
      },
    });
  }

  async deleteById(authorId: string, id: string): Promise<void> {
    if (!authorId || !id) return;

    await this.docsRepository.delete({
      id,
      author: {
        id: authorId,
      },
    });
  }

  async existsByAuthorName(authorId: string, name: string): Promise<boolean> {
    if (!authorId || !name) return;

    return await this.docsRepository.exists({
      where: {
        author: {
          id: authorId,
        },
        name,
      },
    });
  }

  async editById(authorId: string, id: string, doc: Partial<Docs>): Promise<void> {
    if (!authorId || !id) return;

    await this.docsRepository.update({
      id,
      author: {
        id: authorId,
      },
    }, doc);
  }
}