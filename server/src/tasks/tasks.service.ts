import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './entities/task.entity';
import { TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role, type UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  async create(createTaskDto: CreateTaskDto, currentUser: UserDocument): Promise<Task> {
    try {
      const isAdmin = currentUser.roles.includes(Role.ADMIN);

      const assignedTo = isAdmin && createTaskDto.assignedTo
        ? new Types.ObjectId(createTaskDto.assignedTo)
        : currentUser._id;

      const task = new this.taskModel({
        ...createTaskDto,
        createdBy: currentUser._id,
        assignedTo,
      });

      return await task.save();
    } catch (error) {
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  async findAll(currentUser: UserDocument): Promise<Task[]> {
    try {
      const isAdmin = currentUser.roles.includes(Role.ADMIN);

      const filter = isAdmin ? {} : { assignedTo: currentUser._id };

      return await this.taskModel
        .find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new BadRequestException('Failed to load tasks: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    try {
      const task = await this.taskModel
        .findById(id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .exec();

      if (!task) throw new NotFoundException('Task not found');
      return task;
    } catch (error) {
      throw new BadRequestException('Failed to find task: ' + error.message);
    }
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    currentUser: UserDocument,
  ): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');

    const isAdmin = currentUser.roles.includes(Role.ADMIN);

    if (!isAdmin && task.assignedTo.toString() !== currentUser._id.toString()) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    Object.assign(task, updateTaskDto);
    return await task.save();
  }

  async remove(id: string, currentUser: UserDocument): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');

    const isAdmin = currentUser.roles.includes(Role.ADMIN);

    if (!isAdmin && task.assignedTo.toString() !== currentUser._id.toString()) {
      throw new ForbiddenException('You are not allowed to delete this task');
    }

    await this.taskModel.deleteOne({ _id: id }).exec();
    return { message: 'Task deleted successfully' };
  }
}
