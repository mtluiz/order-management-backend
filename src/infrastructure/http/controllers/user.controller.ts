import { Controller, Get, Put, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GetUserProfileUseCase } from '@/application/use-cases/user/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from '@/application/use-cases/user/update-user-profile.usecase';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/infrastructure/auth/decorators/current-user.decorator';
import { UpdateUserDto, UserResponseDto } from '@/interfaces/dtos/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: { id: string }): Promise<UserResponseDto> {
    try {
      return await this.getUserProfileUseCase.execute(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() body: UpdateUserDto
  ): Promise<UserResponseDto> {
    try {
      // Remove role from the DTO if present - only admins should be able to change roles
      const { role, ...updateData } = body;
      
      return await this.updateUserProfileUseCase.execute(user.id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 