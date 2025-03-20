import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  @ApiOperation({ summary: 'Get User Profile', description: 'Returns the profile of the authenticated user.' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  getProfile(@Request() req) {
    return 'This must be the user';
  }
}
