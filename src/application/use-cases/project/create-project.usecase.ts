import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { CreateProjectDto, ProjectResponseDto } from '@/interfaces/dtos/project.dto';

export class CreateProjectUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    const project = new Project(
      crypto.randomUUID(),
      dto.name,
      dto.description,
    );
    
    const created = await this.projectRepo.create(project);
    return ProjectResponseDto.fromEntity(created);
  }
} 