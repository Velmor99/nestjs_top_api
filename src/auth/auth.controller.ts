import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto.ts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { email, password }: AuthDto) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user.email);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const user = this.authService.find(dto.email);
    if (!user) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    } else {
      return this.authService.create(dto);
    }
  }
}
