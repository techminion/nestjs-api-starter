import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { constants } from 'src/config/constants';
import { BaseResponse } from 'src/interfaces/base-response.interface';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!(await bcrypt.compare(password.trim(), user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<BaseResponse<{ token: string; user: Partial<UserDocument> }>> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    const token = this.generateToken(user);
    return {
      message: 'Login Successful',
      data: { token, user: this.removePassword(user) },
    };
  }

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<BaseResponse<{ token: string; user: Partial<UserDocument> }>> {
    const { email, password, userName } = createUserDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const newUser = await this.userService.createUser(email, password, userName, 'user');

    const token = this.generateToken(newUser, '15m');
    await this.sendEmail(
      email,
      'Verify Your Email',
      `Click here to verify: http://localhost:3000/auth/verify?token=${token}`,
    );
    return {
      message: 'User registered successfully',
      data: { token, user: this.removePassword(newUser) },
    };
  }

  async verifyEmail(token: string): Promise<BaseResponse<{ email: string; newToken: string }>> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.updateUser(payload.email, { isVerified: true });
      if (!user) {
        throw new BadRequestException('Failed to verify the user');
      }
      const newToken = this.generateToken(user);
      return { message: 'Email verified successfully', data: { email: user.email, newToken } };
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(email: string): Promise<BaseResponse<null>> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const token: string = this.jwtService.sign({ email }, { expiresIn: '15m' });
      await this.sendEmail(
        email,
        'Reset Password',
        `Click here to reset your password: http://localhost:3000/auth/reset-password?token=${token}`,
      );

      return { message: 'Check your email for password reset link', data: null };
    } catch (error) {
      this.logger.error(`Error in forgotPassword for email ${email}:`, error);
      throw new InternalServerErrorException('Failed to process forgot password request');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<BaseResponse<null>> {
    try {
      const payload: { email: string } = this.jwtService.verify(token);
      const hashedPassword: string = await bcrypt.hash(newPassword, 10);

      const updatedUser = await this.userService.updateUser(payload.email, {
        password: hashedPassword,
      });

      if (!updatedUser) {
        throw new BadRequestException('User not found or update failed');
      }

      return { message: 'Password reset successful', data: null };
    } catch (error) {
      this.logger.error('Error in resetPassword:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private generateToken(user: UserDocument, time: string = '1d'): string {
    try {
      return this.jwtService.sign({ email: user.email }, { expiresIn: time });
    } catch (error) {
      this.logger.error('Token generation failed:', error);
      throw new UnauthorizedException('Failed to generate authentication token');
    }
  }

  private async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.mailService.sendMail({
        from: constants.email.from,
        to,
        subject,
        text,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  private removePassword(user: UserDocument): Partial<UserDocument> {
    const jsonObject = user.toJSON();
    delete jsonObject.password;
    return jsonObject;
  }
}
