import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './sessions.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}