import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { constants } from 'src/config/constants';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interface/auth-response.interface';

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
    user && this.logger.log(await bcrypt.compareSync(password, user.password));
    if (user && (await bcrypt.compare(password.trim(), user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    const token = this.generateToken(user);
    return {
      userId: user._id as string,
      email: user.email,
      token,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { email, password, username } = createUserDto;

    const newUser = await this.userService.createUser(email, password);

    const token = this.generateToken(newUser, '15m');
    await this.sendEmail(
      email,
      'Verify Your Email',
      `Click here to verify: http://localhost:3000/auth/verify?token=${token}`,
    );

    return {
      userId: newUser._id as string,
      email: newUser.email,
      token,
      message: 'Check your email for verification link',
    };
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      await this.userService.updateUser(payload.email, { isVerified: true });
      return { message: 'Email verified successfully' };
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private generateToken(user: UserDocument, time: string = '1d'): string {
    return this.jwtService.sign({ email: user.email }, { expiresIn: time });
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    const messageId = await this.mailService.sendMail({
      from: constants.email.from,
      to,
      subject,
      text,
    });
    if (messageId) {
      return true;
    }
    return false;
  }
}
