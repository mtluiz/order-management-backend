import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { CreateServiceOrderDto, ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';
import { randomUUID } from 'crypto';

export class CreateServiceOrderUseCase {
  constructor(
    private readonly serviceOrderRepo: IServiceOrderRepository,
    private readonly projectRepo: IProjectRepository
  ) {}

  async execute(dto: CreateServiceOrderDto): Promise<ServiceOrderResponseDto> {
    // Verify project exists
    const project = await this.projectRepo.findById(dto.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const serviceOrder = new ServiceOrder(
      randomUUID(),
      dto.name,
      dto.category,
      dto.description || null,
      dto.projectId,
      new Date(),
      new Date(),
      false
    );
    
    const created = await this.serviceOrderRepo.create(serviceOrder);
    return ServiceOrderResponseDto.fromEntity(created);
  }
} 