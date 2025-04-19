import { User } from '@/domain/entities/user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
  user: UserResponseDto;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;

  static fromEntity(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      role: entity.role
    };
  }

  static fromEntities(entities: User[]): UserResponseDto[] {
    return entities.map(entity => UserResponseDto.fromEntity(entity));
  }
} 