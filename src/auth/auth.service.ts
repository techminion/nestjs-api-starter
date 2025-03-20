import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

    const token = this.generateToken(newUser);

    return {
      userId: newUser._id as string,
      email: newUser.email,
      token,
    };
  }

  private generateToken(user: UserDocument): string {
    return this.jwtService.sign({ email: user.email });
  }
}
