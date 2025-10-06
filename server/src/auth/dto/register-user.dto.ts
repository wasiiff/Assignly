import { IsArray, IsString, IsOptional } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roles?: string[];
}
