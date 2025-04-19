import { Module } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { ProjectRepository } from '@/infrastructure/database/repositories/project.repository';
import { ServiceOrderRepository } from '@/infrastructure/database/repositories/service-order.repository';
import { CreateServiceOrderUseCase } from '@/application/use-cases/service-order/create-service-order.usecase';
import { ListServiceOrdersUseCase } from '@/application/use-cases/service-order/list-service-orders.usecase';
import { GetServiceOrderUseCase } from '@/application/use-cases/service-order/get-service-order.usecase';
import { UpdateServiceOrderUseCase } from '@/application/use-cases/service-order/update-service-order.usecase';
import { DeleteServiceOrderUseCase } from '@/application/use-cases/service-order/delete-service-order.usecase';
import { ListServiceOrdersByProjectUseCase } from '@/application/use-cases/service-order/list-service-orders-by-project.usecase';
import { ServiceOrderController } from '../controllers/service-order.controller';

@Module({
  imports: [],
  controllers: [ServiceOrderController],
  providers: [
    PrismaService,
    ServiceOrderRepository,
    ProjectRepository,
    {
      provide: CreateServiceOrderUseCase,
      useFactory: (orderRepo: ServiceOrderRepository, projectRepo: ProjectRepository) => 
        new CreateServiceOrderUseCase(orderRepo, projectRepo),
      inject: [ServiceOrderRepository, ProjectRepository],
    },
    {
      provide: ListServiceOrdersUseCase,
      useFactory: (repo: ServiceOrderRepository) => new ListServiceOrdersUseCase(repo),
      inject: [ServiceOrderRepository],
    },
    {
      provide: GetServiceOrderUseCase,
      useFactory: (repo: ServiceOrderRepository) => new GetServiceOrderUseCase(repo),
      inject: [ServiceOrderRepository],
    },
    {
      provide: UpdateServiceOrderUseCase,
      useFactory: (repo: ServiceOrderRepository) => new UpdateServiceOrderUseCase(repo),
      inject: [ServiceOrderRepository],
    },
    {
      provide: DeleteServiceOrderUseCase,
      useFactory: (repo: ServiceOrderRepository) => new DeleteServiceOrderUseCase(repo),
      inject: [ServiceOrderRepository],
    },
    {
      provide: ListServiceOrdersByProjectUseCase,
      useFactory: (orderRepo: ServiceOrderRepository, projectRepo: ProjectRepository) => 
        new ListServiceOrdersByProjectUseCase(orderRepo, projectRepo),
      inject: [ServiceOrderRepository, ProjectRepository],
    },
  ],
})
export class ServiceOrderModule {} 