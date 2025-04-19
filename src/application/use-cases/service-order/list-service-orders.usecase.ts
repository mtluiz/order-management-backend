import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';

export class ListServiceOrdersUseCase {
  constructor(private readonly serviceOrderRepo: IServiceOrderRepository) {}

  async execute(): Promise<ServiceOrderResponseDto[]> {
    const serviceOrders = await this.serviceOrderRepo.findAll();
    return ServiceOrderResponseDto.fromEntities(serviceOrders);
  }
} 