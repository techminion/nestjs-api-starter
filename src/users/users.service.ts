import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      this.logger.log(`User data fetched: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by email: ${email}`, error);
      throw new InternalServerErrorException('Failed to fetch user data');
    }
  }

  async createUser(
    email: string,
    password: string,
    userName: string,
    role: 'user' | 'admin' = 'user',
  ): Promise<UserDocument> {
    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);

      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        userName: userName || '',
        role,
        isVerified: false,
      });

      return await newUser.save();
    } catch (error) {
      this.logger.error(`Error creating user with email: ${email}`, error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(email: string, updateData: Partial<UserDocument>): Promise<UserDocument | null> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate({ email }, updateData, { new: true })
        .exec();

      if (!updatedUser) {
        throw new BadRequestException('User not found');
      }

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user with email: ${email}`, error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
