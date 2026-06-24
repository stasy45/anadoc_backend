import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { DocsDTO, DocsNameDTO, DocsQueryDTO } from "@/dtos/docs.dto";
import { DocInUserGuard } from "@/guards/docs/docs-in-user.guard";
import { DocsService } from "./docs.service";



@Controller('docs')
export class DocsController {
    constructor(
        private docsService: DocsService,
    ) { }

    @Get()
    async getDocs(
        @Req() req: Request,
        @Query() query: DocsQueryDTO
    ): Promise<DocsDTO[]> {
        return await this.docsService.getDocs(req.user.id, query)
    }

    @Delete('delete/all')
    async deleteAllDocs(
        @Req() req: Request
    ): Promise<void> {
        return await this.docsService.deleteAllDocs(req.user.id)
    }

    @UseGuards(DocInUserGuard)
    @Delete('delete/:docId')
    async deleteDoc(
        @Req() req: Request,
        @Param('docId') docId: string
    ): Promise<void> {
        return await this.docsService.deleteDoc(req.user.id, docId)
    }

    @UseGuards(DocInUserGuard)
    @Patch('rename/:docId')
    async patchDocName(
        @Req() req: Request,
        @Param('docId') docId: string,
        @Body() body: DocsNameDTO,
    ): Promise<void> {
        return await this.docsService.patchDocName(req.user.id, docId, body)
    }
}