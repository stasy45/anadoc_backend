import { DeleteResult, Repository } from 'typeorm';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from '@/entities/users/sessions.entity';




@Injectable()
export class SessionsDB {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) { }

  async findOneById(id: string): Promise<Session | null> {
    if (!id) return null;
    return await this.sessionsRepository.findOneBy({ id });
  }

  async createSession(session: Partial<Session>): Promise<Session | null> {
    return await this.sessionsRepository.save(session);
  }

  async updateSession(session: Session): Promise<Session | null> {
    return await this.sessionsRepository.save(session);
  }

  async deleteSession(id: string): Promise<DeleteResult | null> {
    if (!id) return null;
    return await this.sessionsRepository.delete(id);
  }
}