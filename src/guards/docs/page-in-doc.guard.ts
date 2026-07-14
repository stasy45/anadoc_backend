import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { VALIDATION } from '@/env';
import { DocsDB } from '@/services/docs/docs.db';

@Injectable()
export class PageInDocGuard implements CanActivate {
    constructor(
        private readonly docsDB: DocsDB,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const docId = request.params.docId;
        const pageId = request.params.pageId;

        const doc = await this.docsDB.findOneById(docId, { relations: { pages: true } });

        if (!doc) {
            throw new NotFoundException(VALIDATION.NOPERMISSION);
        }

        if (!doc.pages.find(page => page.id === pageId)) {
            throw new ForbiddenException(VALIDATION.NOPERMISSION);
        }

        request.doc = doc;

        return true;
    }
}