import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(loginUser: LoginDto): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(loginUser.email);
    if (user && await bcrypt.compare(loginUser.password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUser: CreateUserDto): Promise<User> {
    const userDoc = await this.usersService.create(createUser);
    return userDoc.toObject();
  }
}
