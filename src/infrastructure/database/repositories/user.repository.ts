import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { User } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role
      }
    });

    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id }
    });

    return data ? this.mapToEntity(data) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email }
    });

    return data ? this.mapToEntity(data) : null;
  }

  async update(user: User): Promise<User> {
    const data = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    return this.mapToEntity(data);
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const data = await this.prisma.user.update({
      where: { id },
      data: { password }
    });

    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private mapToEntity(data: any): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.name,
      data.role
    );
  }
} 