import { Controller, Get, Query, Req } from "@nestjs/common";
import { Request } from 'express';
import { Docs } from "@/entities/docs/docs.entity";
import { DocsQueryDto } from "@/dtos/docs.dto";
import { DocsService } from "./docs.service";



@Controller('docs')
export class DocsController {
    constructor(
        private docsService: DocsService,
    ) { }

    @Get()
    async getDocs(@Req() req: Request, @Query() query: DocsQueryDto): Promise<Docs[] | null> {
        console.log(req.user)
        return null
    }
}