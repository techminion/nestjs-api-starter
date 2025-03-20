import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email: email }).exec();
    this.logger.log('UserData fetched', user);
    return user;
  }

  async createUser(email: string, password: string): Promise<UserDocument> {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }
}
