import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { ProjectResponseDto } from '@/interfaces/dtos/project.dto';

export class GetProjectUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new Error('Project not found');
    
    return ProjectResponseDto.fromEntity(project);
  }
} 