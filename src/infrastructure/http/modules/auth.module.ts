import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { AuthService } from '@/infrastructure/auth/auth.service';
import { JwtStrategy } from '@/infrastructure/auth/strategies/jwt.strategy';
import { RegisterUseCase } from '@/application/use-cases/auth/register.usecase';
import { LoginUseCase } from '@/application/use-cases/auth/login.usecase';
import { ChangePasswordUseCase } from '@/application/use-cases/auth/change-password.usecase';
import { AuthController } from '@/infrastructure/http/controllers/auth.controller';
import { JwtConfig } from '@/infrastructure/config/JwtConfig';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JwtConfig.SECRET,
      signOptions: { expiresIn: JwtConfig.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    UserRepository,
    AuthService,
    JwtStrategy,
    {
      provide: RegisterUseCase,
      useFactory: (userRepo: UserRepository, authService: AuthService) => 
        new RegisterUseCase(userRepo, authService),
      inject: [UserRepository, AuthService],
    },
    {
      provide: LoginUseCase,
      useFactory: (userRepo: UserRepository, authService: AuthService) => 
        new LoginUseCase(userRepo, authService),
      inject: [UserRepository, AuthService],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (userRepo: UserRepository, authService: AuthService) => 
        new ChangePasswordUseCase(userRepo, authService),
      inject: [UserRepository, AuthService],
    },
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {} 