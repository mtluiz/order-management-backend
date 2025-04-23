import { Module } from '@nestjs/common';
import { AppController } from '@/infrastructure/http/controllers/app.controller';
import { AppService } from '@/application/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from '@/infrastructure/http/modules/project.module';
import { ServiceOrderModule } from '@/infrastructure/http/modules/service-order.module';
import { AuthModule } from '@/infrastructure/http/modules/auth.module';
import { UserModule } from '@/infrastructure/http/modules/user.module';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000,
      limit: 30,
    }]),
    ProjectModule,
    ServiceOrderModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
