import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Hard-coded user for now. Replace with a DB lookup + hashed passwords later.
const HARDCODED_USERS = [
  {
    id: 1,
    username: 'admin@enginexlabs.ph',
    password: 'CCC03CCC06CCC10',
  },
  {
    id: 1,
    username: 'admin@northtrop.ph',
    password: 'CCC03CCC06CCC10',
  },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    const user = HARDCODED_USERS.find((u) => u.username === username);
    if (!user || password !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
