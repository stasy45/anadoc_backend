import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Pages } from './pages.entity';



@Entity('docs')
@Index(['authorId'])
export class Docs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @Column()
  authorId: string;

  @ManyToOne(() => User, (user) => user.docs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'authorId',
  })
  author: User;

  @OneToMany(() => Pages, (pages) => pages.doc)
  pages: Pages[];
}