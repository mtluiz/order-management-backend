import { Project } from '@/domain/entities/project.entity';

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: { id: string };
    where?: any;
    orderBy?: any;
  }): Promise<{ data: Project[]; total: number }>;
  update(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
}
