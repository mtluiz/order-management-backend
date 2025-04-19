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
    // Find user by email
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.authService.comparePasswords(
      dto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    return this.authService.generateToken(user);
  }
} 