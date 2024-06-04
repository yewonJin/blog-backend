import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(id: string, password: string): Promise<string> {
    if (!id || !password) {
      throw new BadRequestException('아이디 혹은 비밀번호를 입력해주세요');
    }

    if (
      id !== process.env.ADMIN_ID ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException(
        '아이디 혹은 비밀번호가 일치하지 않습니다',
      );
    }

    return this.jwtService.sign({ id: 'admin' });
  }

  async verifyJWT(jwt: string) {
    if (!jwt) {
      throw new ForbiddenException('토큰이 없습니다');
    }

    const isVerified = this.jwtService.verify(jwt);

    if (!isVerified) {
      throw new ForbiddenException('토큰이 잘못되었습니다.');
    }

    return { message: '토큰 검증 성공', statusCode: 200 };
  }
}
