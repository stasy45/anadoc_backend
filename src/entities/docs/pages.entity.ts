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
import { Docs } from './docs.entity';

// ─── Inline-элемент внутри children ──────────────────────────────────────────
export interface PageContentChild {
    text: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
    kbd: boolean;
    type?: 'code_line';
}

// ─── Блок страницы ───────────────────────────────────────────────────────────
export type BlockType =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'hr'
    | 'toggle'
    | 'code_block'
    | 'blockquote';

export type AlignType = 'left' | 'center' | 'right';

export type ListStyleType = 'disc' | 'decimal' | 'todo';

export interface PageContentBlock {
    id: string;
    type: BlockType;
    children: PageContentChild[];
    align?: AlignType;
    indent?: number;
    listStyleType?: ListStyleType;
    listStart?: number;
    listRestartPolite?: number;
    checked?: boolean;
}

// ─── Entity ──────────────────────────────────────────────────────────────────
@Entity('pages')
@Index(['docId'])
export class Pages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string;

    /** Наполнение страницы — массив блоков с вложенными inline-элементами */
    @Column({ type: 'jsonb', default: [] })
    content: PageContentBlock[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    editedAt: Date;

    @Column()
    docId: string;

    @ManyToOne(() => Docs, (docs) => docs.pages, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'docId' })
    doc: Docs;
}