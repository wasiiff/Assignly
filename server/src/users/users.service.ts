import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUser: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: createUser.email }).exec();
    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    const createdUser = new this.userModel({ ...createUser, password: hashedPassword });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid user ID');
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid user ID');
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid user ID');
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException(`User with ID ${id} not found`);
  }
}
