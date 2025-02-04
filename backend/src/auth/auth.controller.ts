import { Controller, Post, Body, Get, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.gard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('userRoute')
  essai(@Request() req) {
    return this.authService.essai(req);
  }
}
