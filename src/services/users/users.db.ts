import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '@/entities/users/users.entity';




@Injectable()
export class UsersDB {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findOneById(id: string): Promise<User | null> {
    if (!id) return null;
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return await this.usersRepository.findOneBy({ email });
  }

  async createUser(user: Partial<User>): Promise<User | null> {
    return await this.usersRepository.save(user);
  }
}