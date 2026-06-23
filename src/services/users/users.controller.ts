import { Controller, Get, Req } from "@nestjs/common";
import { Request } from 'express';
import { User } from "@/entities/users/users.entity";



@Controller('users')
export class UsersController {
    constructor(
    ) { }

    @Get('info')
    async getUserInfo(@Req() req: Request): Promise<User> {
        return req.user
    }
}