import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { UserResponseDto } from '@/interfaces/dtos/user.dto';
import { NotFoundException } from '@nestjs/common';

export class GetUserProfileUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return UserResponseDto.fromEntity(user);
  }
} 