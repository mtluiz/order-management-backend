import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { PaginatedProjectResponseDto, ProjectResponseDto } from '@/interfaces/dtos/project.dto';

export class ListProjectsUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(params?: {
    skip?: number;
    take?: number;
    cursor?: { id: string };
    where?: any;
    orderBy?: any;
  }): Promise<PaginatedProjectResponseDto> {
    const result = await this.projectRepo.findAll(params);
    return {
      data: result.data,
      total: result.total
    };
  }
} 