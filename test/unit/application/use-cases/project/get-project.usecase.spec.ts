import { GetProjectUseCase } from '@/application/use-cases/project/get-project.usecase';
import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

describe('GetProjectUseCase', () => {
  let useCase: GetProjectUseCase;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    useCase = new GetProjectUseCase(mockProjectRepo);
  });

  describe('execute', () => {
    it('should throw error if project does not exist', async () => {
      const id = 'non-existent-id';
      mockProjectRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow('Project not found');
      expect(mockProjectRepo.findById).toHaveBeenCalledWith(id);
    });

    it('should return project if it exists', async () => {
      const id = 'project-1';
      const mockProject = new Project(
        'Project 1',
        id,
        'Description',
        new Date(),
        new Date()
      );
      
      mockProjectRepo.findById.mockResolvedValue(mockProject);

      const result = await useCase.execute(id);

      expect(mockProjectRepo.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockProject);
    });
  });
}); 