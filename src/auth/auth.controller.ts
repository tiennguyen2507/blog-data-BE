import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  Login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('/register')
  Register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @UseGuards(AuthGuard)
  @Get('/info')
  Info(@Request() request) {
    const { id } = request['user_data'];

    return this.authService.getInfo(id);
  }
}
