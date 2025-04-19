import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.projectRepo.findById(id);
    if (!existing) throw new Error('Project not found');
    
    await this.projectRepo.delete(id);
  }
} 