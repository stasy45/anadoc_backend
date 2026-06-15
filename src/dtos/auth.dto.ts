import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { VALIDATION } from '@/env';

export class LoginDTO {
    @IsEmail({}, { message: VALIDATION.DATAERROR })
    email: string;

    @IsString({ message: VALIDATION.DATAERROR })
    @MinLength(6, { message: VALIDATION.DATAERROR })
    password: string;
}


export class RegistrationDto {
    @IsString({ message: VALIDATION.DATAERROR })
    @MinLength(2, { message: VALIDATION.DATAERROR })
    @MaxLength(50, { message: VALIDATION.DATAERROR })
    name: string;

    @IsEmail()
    email: string;

    @IsString({ message: VALIDATION.DATAERROR })
    @MinLength(8, { message: VALIDATION.DATAERROR })
    @MaxLength(64, { message: VALIDATION.DATAERROR })
    password: string;
}