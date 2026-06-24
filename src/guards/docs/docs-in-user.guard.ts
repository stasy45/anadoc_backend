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
export class DocInUserGuard implements CanActivate {
    constructor(
        private readonly docsDB: DocsDB,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = request.user.id;
        const docId = request.params.docId;

        const doc = await this.docsDB.findOneById(docId, { relations: { author: true } });

        if (!doc) {
            throw new NotFoundException(VALIDATION.DOCNOTFOUND);
        }

        if (doc.author.id !== userId) {
            throw new ForbiddenException(VALIDATION.DOCNOPERMISSION);
        }

        request.doc = doc;

        return true;
    }
}