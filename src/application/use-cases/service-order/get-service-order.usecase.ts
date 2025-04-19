import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';

export class GetServiceOrderUseCase {
  constructor(private readonly serviceOrderRepo: IServiceOrderRepository) {}

  async execute(id: string): Promise<ServiceOrderResponseDto> {
    const serviceOrder = await this.serviceOrderRepo.findById(id);
    if (!serviceOrder) {
      throw new Error('Service order not found');
    }
    
    return ServiceOrderResponseDto.fromEntity(serviceOrder);
  }
} 