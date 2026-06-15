import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { THROTTLE_KEY, ThrottleOptions } from './thottle.decorator';


@Injectable()
export class ThrottleGuard
    implements CanActivate {
    private readonly storage = new Map<
        string,
        number[]
    >();

    constructor(
        private readonly reflector: Reflector,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const options =
            this.reflector.getAllAndOverride<ThrottleOptions>(
                THROTTLE_KEY,
                [context.getHandler(), context.getClass()],
            );

        if (!options) {
            return true;
        }

        const request =
            context.switchToHttp().getRequest();

        const ip =
            request.ip ||
            request.headers['x-forwarded-for'] ||
            'unknown';

        const now = Date.now();

        const requests =
            this.storage.get(ip) ?? [];

        const validRequests = requests.filter(
            (timestamp) =>
                now - timestamp < options.ttl,
        );

        if (
            validRequests.length >= options.limit
        ) {
            throw new HttpException(
                `Лимит ${options.limit} запросов за ${options.ttl / 1000} секунд превышен`,
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        validRequests.push(now);

        this.storage.set(ip, validRequests);

        return true;
    }
}