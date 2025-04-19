import { Project } from '@/domain/entities/project.entity';

export class CreateProjectDto {
  name: string;
  description?: string;
}

export class UpdateProjectDto {
  name: string;
  description?: string;
}

export class ProjectResponseDto {
  id: string;
  name: string;
  description?: string;

  static fromEntity(entity: Project): ProjectResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  static fromEntities(entities: Project[]): ProjectResponseDto[] {
    return entities.map(entity => ProjectResponseDto.fromEntity(entity));
  }
} 