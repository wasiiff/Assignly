import { IsArray, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @IsString({ each: true })
  role: string[];

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
