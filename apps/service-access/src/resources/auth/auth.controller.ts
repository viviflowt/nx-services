import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { Request } from 'express';

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
  async findAll(@Req() req: Request) {
    console.log('headers');
    console.log(req.headers);
    return this.authService.getProfile();
  }
}
