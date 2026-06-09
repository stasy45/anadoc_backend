import * as bcrypt from 'bcrypt';

import { Injectable } from "@nestjs/common";
import { UsersDB } from '../users/users.db';



@Injectable()
export class AuthService {
  constructor(
    private usersDB: UsersDB,
  ) { }

  async postLogin(email: string, password: string): Promise<string> {
    let user = await this.usersDB.findOneByEmail(email);

    if (user) {
      return user.id
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      return (await this.usersDB.createUser({ email, password: passwordHash })).id
    }
  }

}