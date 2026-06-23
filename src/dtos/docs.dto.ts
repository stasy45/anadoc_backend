import { VALIDATION } from "@/env";
import { IsString, MinLength, MaxLength } from "class-validator";





export class DocsQueryDto {
    @IsString({ message: VALIDATION.DATAERROR })
    @MinLength(2, { message: VALIDATION.DATAERROR })
    @MaxLength(50, { message: VALIDATION.DATAERROR })
    searchLine: string;
}