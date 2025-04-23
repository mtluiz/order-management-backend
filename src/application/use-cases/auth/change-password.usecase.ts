import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { ChangePasswordDto } from '@/interfaces/dtos/user.dto';
import { AuthService } from '@/infrastructure/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(userId: string, dto: ChangePasswordDto): Promise<void> {

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.authService.comparePasswords(
      dto.oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await this.authService.hashPassword(dto.newPassword);

    user.password = hashedPassword;
    await this.userRepo.update(user);
  }
} 