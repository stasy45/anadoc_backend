import { IsString, MinLength, MaxLength, IsOptional } from "class-validator";
import { VALIDATION } from "@/env";
import { Docs } from "@/entities/docs/docs.entity";





export class DocsQueryDTO {
    @IsString({ message: VALIDATION.DATAERROR })
    @IsOptional()
    @MinLength(2, { message: VALIDATION.DATAERROR })
    @MaxLength(50, { message: VALIDATION.DATAERROR })
    searchLine: string;
}

export class DocsNameDTO {
    @IsString({ message: VALIDATION.DATAERROR })
    @MinLength(2, { message: VALIDATION.DATAERROR })
    @MaxLength(50, { message: VALIDATION.DATAERROR })
    name: string;
}

export interface DocsDTO extends Omit<Docs, 'author'> { }