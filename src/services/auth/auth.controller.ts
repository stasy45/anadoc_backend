import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { AuthGuard } from "@/guards/auth/auth.guard";
import { Throttle } from "@/guards/throttle/thottle.decorator";
import { LoginDTO, RegistrationDto } from "@/dtos/auth.dto";
import { AuthService } from "./auth.service";



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @UseGuards(AuthGuard)
    @Get('session')
    async getSession(@Req() req: Request): Promise<void> { }

    @Post('login')
    @Throttle(5, 60_000)
    async postLogin(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const token = await this.authService.postLogin(
            body.email,
            body.password,
        );

        res.cookie('sessionToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });
    }

    @Post('registration')
    @Throttle(5, 60_000)
    async registration(
        @Body() body: RegistrationDto,
    ): Promise<void> {
        await this.authService.postRegistration(
            body.name,
            body.email,
            body.password
        );
    }
}