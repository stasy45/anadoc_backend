import { Controller, Get, Req } from "@nestjs/common";
import { Request } from 'express';
import { UserDTO } from "@/dtos/users.dto";



@Controller('users')
export class UsersController {
    constructor(
    ) { }

    @Get('info')
    async getUserInfo(
        @Req() req: Request
    ): Promise<UserDTO> {
        return {
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt
        }
    }
}