import { Module } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { GetUserProfileUseCase } from '@/application/use-cases/user/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from '@/application/use-cases/user/update-user-profile.usecase';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    UserRepository,
    {
      provide: GetUserProfileUseCase,
      useFactory: (repo: UserRepository) => new GetUserProfileUseCase(repo),
      inject: [UserRepository],
    },
    {
      provide: UpdateUserProfileUseCase,
      useFactory: (repo: UserRepository) => new UpdateUserProfileUseCase(repo),
      inject: [UserRepository],
    },
  ],
})
export class UserModule {} 