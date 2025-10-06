import { IsArray, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  role?: string[];

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
