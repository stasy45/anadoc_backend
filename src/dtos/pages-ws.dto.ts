import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
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
    @IsString({ message: VALIDATION.DATAERROR })
    text: string;

    @IsBoolean({ message: VALIDATION.DATAERROR })
    bold: boolean;

    @IsBoolean({ message: VALIDATION.DATAERROR })
    italic: boolean;

    @IsBoolean({ message: VALIDATION.DATAERROR })
    underline: boolean;

    @IsBoolean({ message: VALIDATION.DATAERROR })
    strikethrough: boolean;

    @IsBoolean({ message: VALIDATION.DATAERROR })
    code: boolean;

    @IsBoolean({ message: VALIDATION.DATAERROR })
    kbd: boolean;

    @IsOptional()
    @IsIn(['code_line'], { message: VALIDATION.DATAERROR })
    type?: 'code_line';
}

export class PageContentBlockDTO {
    @IsString({ message: VALIDATION.DATAERROR })
    @IsNotEmpty({ message: VALIDATION.DATAERROR })
    id: string;

    @IsIn(BLOCK_TYPES, { message: VALIDATION.DATAERROR })
    type: BlockType;

    @IsArray({ message: VALIDATION.DATAERROR })
    @ValidateNested({ each: true })
    @Type(() => PageContentChildDTO)
    children: PageContentChildDTO[];

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
    @IsNumber({}, { message: VALIDATION.DATAERROR })
    listRestartPolite?: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
    checked?: boolean;
}

// ==========================================
// DTO для потоков WebSocket
// ==========================================

/**
 * Поток 1: Подключение и валидация прав.
 * Клиент отправляет это один раз при открытии страницы.
 */
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

/**
 * Поток 2: Отправка изменений.
 * Клиент отправляет это при каждом изменении. 
 * Поля сделаны опциональными, чтобы можно было обновить только title или только content.
 */
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

/**
 * Формат ответа сервера при успешном join или update
 */
export interface EditPageResponse {
    title?: string;
    content?: PageContentBlockDTO[];
}