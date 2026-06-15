import { IsEmail, IsString, MinLength } from 'class-validator';
import { VALIDATION } from '@/env';

export class LoginDTO {
    @IsEmail({}, { message: VALIDATION.DATAERROR })
    email: string;

    @IsString({ message: VALIDATION.DATAERROR })
    @MinLength(6, { message: VALIDATION.DATAERROR })
    password: string;
}