import { FindOneOptions, Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '@/entities/users/users.entity';




@Injectable()
export class UsersDB {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findOneById(id: string, options?: FindOneOptions<User>): Promise<User | null> {
    if (!id) return null;
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      ...options
    });
  }

  async findOneByEmail(email: string, options?: FindOneOptions<User>): Promise<User | null> {
    if (!email) return null;
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      ...options
    });
  }

  async createUser(user: Partial<User>): Promise<User | null> {
    return await this.usersRepository.save(user);
  }
}