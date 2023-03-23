import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Protected } from './protected.decorator';
import { Public } from './public.decorator';
import { AuthorizationDto } from './dto/authorization.dto';

@Controller()
@ApiTags('access')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOkResponse({ type: AuthorizationDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify')
  @Protected()
  async check(@Req() req: Request): Promise<void> {
    const authorization = req.headers.authorization;
    console.log(authorization);
    return;
  }
}
