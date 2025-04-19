import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/domain/entities/user.entity';
import { JwtPayload } from '@/interfaces/auth/jwt-payload.interface';
import { UserResponseDto } from '@/interfaces/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(user: User): { accessToken: string, user: UserResponseDto } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: UserResponseDto.fromEntity(user)
    };
  }
} 