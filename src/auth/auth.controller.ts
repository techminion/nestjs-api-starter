import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Public()
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User Login', description: 'Logs in a user and returns a JWT token.' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'User Signup',
    description: 'Registers a new user and sends a verification email.',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Email already in use' })
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({
    summary: 'Verify Email',
    description: "Verifies a user's email using a token sent via email.",
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    this.logger.log('Received verification request', token);
    return this.authService.verifyEmail(token);
  }

  @ApiOperation({
    summary: 'Forgot Password',
    description: "Sends a password reset link to the user's email.",
  })
  @ApiResponse({ status: 200, description: 'Check your email for password reset link' })
  @ApiResponse({ status: 400, description: 'User not found' })
  @ApiBody({ schema: { properties: { email: { type: 'string', example: 'user@example.com' } } } })
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @ApiOperation({
    summary: 'Reset Password',
    description: 'Resets user password using a valid token.',
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBody({
    schema: {
      properties: { token: { type: 'string' }, newPassword: { type: 'string', minLength: 6 } },
    },
  })
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Generates a new access token using a valid refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
