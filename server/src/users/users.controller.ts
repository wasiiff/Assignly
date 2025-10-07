import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from 'src/decorators/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<User> {
    const userDoc = await this.usersService.create(createUser);
    return userDoc.toObject();
  }

  @Post('email')
  async findByEmail(@Body('email') email: string): Promise<User | null> {
    const userDoc = await this.usersService.findByEmail(email);
    return userDoc ? userDoc.toObject() : null;
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users.map(u => u.toObject());
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const userDoc = await this.usersService.findOne(id);
    return userDoc ? userDoc.toObject() : null;
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
    const userDoc = await this.usersService.update(id, updateUserDto);
    return userDoc ? userDoc.toObject() : null;
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
