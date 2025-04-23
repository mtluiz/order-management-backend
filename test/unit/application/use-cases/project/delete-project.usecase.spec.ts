import { DeleteProjectUseCase } from '@/application/use-cases/project/delete-project.usecase';
import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

describe('DeleteProjectUseCase', () => {
  let useCase: DeleteProjectUseCase;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    useCase = new DeleteProjectUseCase(mockProjectRepo);
  });

  describe('execute', () => {
    it('should throw error if project does not exist', async () => {
      const id = 'non-existent-id';
      mockProjectRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow('Project not found');
      expect(mockProjectRepo.findById).toHaveBeenCalledWith(id);
      expect(mockProjectRepo.delete).not.toHaveBeenCalled();
    });

    it('should delete project if it exists', async () => {
      const id = 'project-1';
      const mockProject = new Project(
        'Project 1',
        id,
        'Description',
        new Date(),
        new Date()
      );
      
      mockProjectRepo.findById.mockResolvedValue(mockProject);
      mockProjectRepo.delete.mockResolvedValue();

      await useCase.execute(id);

      expect(mockProjectRepo.findById).toHaveBeenCalledWith(id);
      expect(mockProjectRepo.delete).toHaveBeenCalledWith(id);
    });
  });
}); 