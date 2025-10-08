import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.tasksService.create(createTaskDto, currentUser);
  }

  @Get()
  async findAll(@CurrentUser() currentUser: UserDocument) {
    try {
      return await this.tasksService.findAll(currentUser);
    } catch (error) {
      throw new BadRequestException('Failed to get tasks: ' + error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new BadRequestException('Task not found');
    return task;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.tasksService.update(id, updateTaskDto, currentUser);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.tasksService.remove(id, currentUser);
  }
}
