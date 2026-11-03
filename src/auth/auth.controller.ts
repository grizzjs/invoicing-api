import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto, UserToken } from './dto/user.entity';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Public } from './public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    description: 'Login',
    type: UserToken,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserDto })
  @Public()
  login(@Body() dto: UserDto): Promise<UserToken> {
    return this.authService.login(dto.email, dto.password);
  }
}
