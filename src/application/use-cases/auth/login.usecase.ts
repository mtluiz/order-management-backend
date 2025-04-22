import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { LoginDto, LoginResponseDto } from '@/interfaces/dtos/user.dto';
import { AuthService } from '@/infrastructure/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.authService.comparePasswords(
      dto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }
} 