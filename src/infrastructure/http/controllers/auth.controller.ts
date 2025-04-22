import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Put, HttpCode } from '@nestjs/common';
import { RegisterUseCase } from '@/application/use-cases/auth/register.usecase';
import { LoginUseCase } from '@/application/use-cases/auth/login.usecase';
import { ChangePasswordUseCase } from '@/application/use-cases/auth/change-password.usecase';
import { CreateUserDto, LoginDto, LoginResponseDto, UserResponseDto, ChangePasswordDto } from '@/interfaces/dtos/user.dto';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/infrastructure/auth/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    try {
      return await this.registerUseCase.execute(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    try {
      return await this.loginUseCase.execute(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @CurrentUser() user: { id: string },
    @Body() body: ChangePasswordDto
  ): Promise<void> {
    try {
      await this.changePasswordUseCase.execute(user.id, body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 