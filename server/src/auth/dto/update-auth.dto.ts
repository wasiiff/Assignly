import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './login-user.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
