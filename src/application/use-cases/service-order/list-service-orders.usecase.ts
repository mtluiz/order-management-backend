import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { PaginatedServiceOrderResponseDto, ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';

export class ListServiceOrdersUseCase {
  constructor(private readonly serviceOrderRepo: IServiceOrderRepository) {}

  async execute(params?: {
    skip?: number;
    take?: number;
    cursor?: { id: string };
    where?: any;
    orderBy?: any;
  }): Promise<PaginatedServiceOrderResponseDto> {
    const result = await this.serviceOrderRepo.findAll(params);
    return {
      data: ServiceOrderResponseDto.fromEntities(result.data),
      total: result.total
    };
  }
} 