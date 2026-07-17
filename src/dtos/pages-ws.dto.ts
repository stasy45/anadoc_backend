import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION } from '@/env';
import {
    AlignType,
    BlockType,
    ListStyleType,
} from '@/entities/docs/pages.entity';

const BLOCK_TYPES: BlockType[] = [
    'h1', 'h2', 'h3', 'h4', 'p', 'hr', 'toggle', 'code_block', 'blockquote',
];
const ALIGN_TYPES: AlignType[] = ['left', 'center', 'right'];
const LIST_STYLE_TYPES: ListStyleType[] = ['disc', 'decimal', 'todo'];

// ==========================================
// Вложенные DTO для структуры контента
// ==========================================

export class PageContentChildDTO {
    // text может отсутствовать в узлах-обёртках
    @IsOptional()
    @IsString({ message: VALIDATION.DATAERROR })
    text?: string;

    // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Фронтенд не отправляет false, он просто опускает поле.
    // Без @IsOptional() валидатор падает на undefined.
    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    bold?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    italic?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    underline?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    strikethrough?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    code?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    kbd?: boolean;

    // Расширили тип, так как Plate может слать свои внутренние типы
    @IsOptional()
    @IsString({ message: VALIDATION.DATAERROR })
    type?: string;
}

export class PageContentBlockDTO {
    // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: id может не генерироваться на фронте для некоторых узлов
    @IsOptional()
    @IsString({ message: VALIDATION.DATAERROR })
    id?: string;

    // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: На скриншоте видно, что type отсутствует. Делаем опциональным.
    @IsOptional()
    @IsIn(BLOCK_TYPES, { message: VALIDATION.DATAERROR })
    type?: BlockType;

    @IsOptional()
    @IsArray({ message: VALIDATION.DATAERROR })
    @ValidateNested({ each: true })
    @Type(() => PageContentChildDTO)
    children?: PageContentChildDTO[];

    @IsOptional()
    @IsIn(ALIGN_TYPES, { message: VALIDATION.DATAERROR })
    align?: AlignType;

    @IsOptional()
    @IsInt({ message: VALIDATION.DATAERROR })
    @Min(0, { message: VALIDATION.DATAERROR })
    indent?: number;

    @IsOptional()
    @IsIn(LIST_STYLE_TYPES, { message: VALIDATION.DATAERROR })
    listStyleType?: ListStyleType;

    @IsOptional()
    @IsInt({ message: VALIDATION.DATAERROR })
    listStart?: number;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR }) // Исправлено с IsNumber на IsBoolean, так как это флаг
    listRestartPolite?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    checked?: boolean;
}

// ==========================================
// DTO для потоков WebSocket
// ==========================================

export class JoinPageDTO {
    @IsString({ message: VALIDATION.DATAERROR })
    @IsNotEmpty({ message: VALIDATION.DATAERROR })
    sessionToken: string;

    @IsString({ message: VALIDATION.DATAERROR })
    @IsNotEmpty({ message: VALIDATION.DATAERROR })
    docId: string;

    @IsString({ message: VALIDATION.DATAERROR })
    @IsNotEmpty({ message: VALIDATION.DATAERROR })
    pageId: string;
}

export class EditPageDTO {
    @IsOptional()
    @IsString({ message: VALIDATION.DATAERROR })
    @MaxLength(255, { message: VALIDATION.DATAERROR })
    title?: string;

    @IsOptional()
    @IsArray({ message: VALIDATION.DATAERROR })
    @ValidateNested({ each: true })
    @Type(() => PageContentBlockDTO)
    content?: PageContentBlockDTO[];
}

export interface EditPageResponse {
    title?: string;
    content?: PageContentBlockDTO[];
}