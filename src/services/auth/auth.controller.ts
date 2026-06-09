import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { AuthGuard } from "@/guards/auth.guard";
import { signUserId } from "@/utils/cookie";
import { LoginDTO } from "@/dtos/auth.dto";
import { AuthService } from "./auth.service";



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @UseGuards(AuthGuard)
    @Get('session')
    async getSession(@Req() req: Request): Promise<boolean> {
        return true
    }

    @Post('login')
    async postLogin(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ success: true }> {
        const userId = await this.authService.postLogin(body.email, body.password);

        res.cookie('userId', signUserId(userId), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { success: true };
    }
}