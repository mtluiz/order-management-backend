import { User } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { CreateUserDto, UserResponseDto } from '@/interfaces/dtos/user.dto';
import { AuthService } from '@/infrastructure/auth/auth.service';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await this.authService.hashPassword(dto.password);

    const user = new User(
      randomUUID(),
      dto.email,
      hashedPassword,
      dto.name,
      dto.role || 'user'
    );

    const createdUser = await this.userRepo.create(user);
    return UserResponseDto.fromEntity(createdUser);
  }
} 