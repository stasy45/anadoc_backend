import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { Throttle } from "@/guards/throttle/thottle.decorator";
import { Public } from "@/guards/auth/public.decorator";
import { LoginDTO, RegistrationDTO } from "@/dtos/auth.dto";
import { AuthService } from "./auth.service";



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Get('session')
    async getSession(): Promise<void> { }

    @Public()
    @Post('login')
    @Throttle(5, 60_000)
    async postLogin(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const token = await this.authService.postLogin(body);

        res.cookie('sessionToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });
    }

    @Public()
    @Post('registration')
    @Throttle(5, 60_000)
    async registration(
        @Body() body: RegistrationDTO,
    ): Promise<void> {
        await this.authService.postRegistration(body);
    }
}