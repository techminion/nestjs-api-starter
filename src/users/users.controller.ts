import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  @Get('profile')
  getProfile(@Request() req) {
    return 'This must be the user';
  }
}
