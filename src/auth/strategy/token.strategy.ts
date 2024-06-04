import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.jwt;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const jwt = req?.cookies?.jwt;

    if (!jwt) {
      throw new UnauthorizedException('jwt is undefined');
    }

    return { userId: payload.sub, username: payload.username };
  }
}
