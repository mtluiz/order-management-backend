import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { UpdateUserDto, UserResponseDto } from '@/interfaces/dtos/user.dto';
import { NotFoundException } from '@nestjs/common';

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Update only provided fields
    if (dto.email) user.email = dto.email;
    if (dto.name) user.name = dto.name;
    
    // Only admins can change roles, so this should be checked by the controller
    if (dto.role) user.role = dto.role;
    
    const updated = await this.userRepo.update(user);
    return UserResponseDto.fromEntity(updated);
  }
} 