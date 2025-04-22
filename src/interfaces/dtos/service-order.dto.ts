import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { ProjectResponseDto } from './project.dto';

export class CreateServiceOrderDto {
  name: string;
  category: string;
  description?: string;
  projectId: string;
}

export class UpdateServiceOrderDto {
  name?: string;
  category?: string;
  description?: string;
  isApproved?: boolean;
}

export class ServiceOrderResponseDto {
  id: string;
  name: string;
  category: string;
  description: string | null;
  projectId: string;
  createdDate: Date;
  updatedDate: Date;
  isApproved: boolean;
  project?: ProjectResponseDto;

  static fromEntity(entity: ServiceOrder): ServiceOrderResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category,
      description: entity.description,
      projectId: entity.projectId,
      createdDate: entity.createdDate,
      updatedDate: entity.updatedDate,
      isApproved: entity.isApproved,
      project: entity.project
    };
  }

  static fromEntities(entities: ServiceOrder[]): ServiceOrderResponseDto[] {
    return entities.map(entity => ServiceOrderResponseDto.fromEntity(entity));
  }
} 