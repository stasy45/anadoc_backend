import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    ValidateNested,
    IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION } from '@/env';
// Убедитесь, что пути к вашим типам верны
import { AlignType, BlockType, ListStyleType } from '@/entities/docs/pages.entity';

// Добавлен 'code_line', так как он встречается в вашем JSON внутри code_block
const ALLOWED_TYPES = [
    'h1', 'h2', 'h3', 'h4', 'p', 'hr', 'toggle', 'code_block', 'blockquote', 'code_line'
] as const;

const ALIGN_TYPES = ['left', 'center', 'right'] as const;
const LIST_STYLE_TYPES = ['disc', 'decimal', 'todo'] as const;

/**
 * Универсальный рекурсивный узел контента (Slate Node)
 * В Slate узел может быть одновременно leaf (текст) и element (блок с children).
 * Один класс с опциональными полями решает проблемы валидации union-типов.
 */
export class PageContentNodeDTO {
    @IsOptional()
    @IsString({ message: VALIDATION.DATAERROR })
    id?: string;

    @IsOptional()
    @IsIn(ALLOWED_TYPES, { message: VALIDATION.DATAERROR })
    type?: typeof ALLOWED_TYPES[number];

    // ==========================================
    // Свойства текстового узла (Leaf)
    // ==========================================
    @IsOptional()
    @IsString({ message: VALIDATION.DATAERROR })
    text?: string;

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

    // ==========================================
    // Свойства блочного узла (Element)
    // ==========================================
    // Рекурсивная вложенность: массив таких же узлов
    @IsOptional()
    @IsArray({ message: VALIDATION.DATAERROR })
    @ValidateNested({ each: true })
    @Type(() => PageContentNodeDTO) // <-- Ключевой момент: рекурсивная ссылка на этот же класс
    children?: PageContentNodeDTO[];

    @IsOptional()
    @IsIn(ALIGN_TYPES, { message: VALIDATION.DATAERROR })
    align?: typeof ALIGN_TYPES[number];

    @IsOptional()
    @IsInt({ message: VALIDATION.DATAERROR })
    @Min(0, { message: VALIDATION.DATAERROR })
    indent?: number;

    @IsOptional()
    @IsIn(LIST_STYLE_TYPES, { message: VALIDATION.DATAERROR })
    listStyleType?: typeof LIST_STYLE_TYPES[number];

    @IsOptional()
    @IsInt({ message: VALIDATION.DATAERROR })
    listStart?: number;

    @IsOptional()
    @IsBoolean({ message: VALIDATION.DATAERROR })
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
    @Type(() => PageContentNodeDTO)
    content?: PageContentNodeDTO[];
}

export interface EditPageResponse {
    title?: string;
    content?: PageContentNodeDTO[];
}