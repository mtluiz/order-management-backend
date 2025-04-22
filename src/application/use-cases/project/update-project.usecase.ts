import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { ProjectResponseDto, UpdateProjectDto } from '@/interfaces/dtos/project.dto';

export class UpdateProjectUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(id: string, dto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const existing = await this.projectRepo.findById(id);
    if (!existing) throw new Error('Project not found');
    
    existing.name = dto.name;
    existing.description = dto.description;
    
    const updated = await this.projectRepo.update(existing);
    return updated;
  }
} 