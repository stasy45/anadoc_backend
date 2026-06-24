import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/users.entity';


@Index(['author', 'name'], { unique: true })
@Entity('docs')
export class Docs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @ManyToOne(() => User, (user) => user.docs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'authorId',
  })
  author: User;
}