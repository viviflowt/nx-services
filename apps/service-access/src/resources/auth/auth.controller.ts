import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Protected } from './protected.decorator';
import { Public } from './public.decorator';

@Controller()
@ApiTags('access')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  // @ApiOkResponse({ type: Account })
  async create(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Protected()
  @ApiBearerAuth()
  async getProfile(@Req() req: Request) {
    console.log('headers');
    console.log(req.headers);
    return this.authService.getProfile();
  }
}
