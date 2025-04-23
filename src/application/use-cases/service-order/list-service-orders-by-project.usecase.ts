import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { PaginatedServiceOrderResponseDto, ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';

export class ListServiceOrdersByProjectUseCase {
  constructor(
    private readonly serviceOrderRepo: IServiceOrderRepository,
    private readonly projectRepo: IProjectRepository
  ) {}

  async execute(
    projectId: string,
    params?: {
      skip?: number;
      take?: number;
      cursor?: { id: string };
      where?: any;
      orderBy?: any;
    }
  ): Promise<PaginatedServiceOrderResponseDto> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const result = await this.serviceOrderRepo.findByProject(projectId, params);
    return {
      data: ServiceOrderResponseDto.fromEntities(result.data),
      total: result.total
    };
  }
} 