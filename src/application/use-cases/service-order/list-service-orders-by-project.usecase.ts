import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';

export class ListServiceOrdersByProjectUseCase {
  constructor(
    private readonly serviceOrderRepo: IServiceOrderRepository,
    private readonly projectRepo: IProjectRepository
  ) {}

  async execute(projectId: string): Promise<ServiceOrderResponseDto[]> {
    // Verify project exists
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const serviceOrders = await this.serviceOrderRepo.findByProject(projectId);
    return ServiceOrderResponseDto.fromEntities(serviceOrders);
  }
} 