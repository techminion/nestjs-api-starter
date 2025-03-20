import { Controller, Get, Request } from '@nestjs/common';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  @Get('profile')
  getProfile(@Request() req) {
    return 'This must be the user';
  }
}
