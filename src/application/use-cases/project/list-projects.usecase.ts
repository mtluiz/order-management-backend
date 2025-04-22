import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { ProjectResponseDto } from '@/interfaces/dtos/project.dto';

export class ListProjectsUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepo.findAll();
    return projects;
  }
} 