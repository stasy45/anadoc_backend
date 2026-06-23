import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Docs } from '@/entities/docs/docs.entity';




@Injectable()
export class DocsDB {
  constructor(
    @InjectRepository(Docs)
    private docsRepository: Repository<Docs>,
  ) { }

  async findOneById(id: string): Promise<Docs | null> {
    if (!id) return null;
    return await this.docsRepository.findOneBy({ id });
  }
}