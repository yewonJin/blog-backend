import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.signIn(signInDto.id, signInDto.password);

    res.cookie('jwt', jwt, {
      domain: process.env.BASE_DOMAIN,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    return { message: '로그인 성공', statusCode: 200 };
  }

  @Get('login')
  async verifyToken(@Req() req: Request) {
    return this.authService.verifyJWT(req.cookies['jwt']);
  }
}
