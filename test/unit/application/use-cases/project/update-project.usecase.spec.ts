import { UpdateProjectUseCase } from '@/application/use-cases/project/update-project.usecase';
import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { UpdateProjectDto } from '@/interfaces/dtos/project.dto';

describe('UpdateProjectUseCase', () => {
  let useCase: UpdateProjectUseCase;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    useCase = new UpdateProjectUseCase(mockProjectRepo);
  });

  describe('execute', () => {
    it('should throw error if project does not exist', async () => {
      const id = 'non-existent-id';
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
        description: 'Updated Description'
      };
      mockProjectRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(id, dto)).rejects.toThrow('Project not found');
      expect(mockProjectRepo.findById).toHaveBeenCalledWith(id);
      expect(mockProjectRepo.update).not.toHaveBeenCalled();
    });

    it('should update project if it exists', async () => {
      const id = 'project-1';
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
        description: 'Updated Description'
      };
      
      const existingProject = new Project(
        'Original Project',
        id,
        'Original Description',
        new Date('2023-01-01'),
        new Date('2023-01-01')
      );
      
      mockProjectRepo.findById.mockResolvedValue(existingProject);
      
      const updatedProject = new Project(
        dto.name,
        id,
        dto.description,
        existingProject.createdDate,
        new Date()
      );
      
      mockProjectRepo.update.mockResolvedValue(updatedProject);

      const result = await useCase.execute(id, dto);

      expect(mockProjectRepo.findById).toHaveBeenCalledWith(id);
      expect(mockProjectRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id,
          name: dto.name,
          description: dto.description
        })
      );
      
      expect(result).toEqual(updatedProject);
    });

    it('should handle optional description field', async () => {
      const id = 'project-1';
      const dto: UpdateProjectDto = {
        name: 'Updated Project'
      };
      
      const existingProject = new Project(
        'Original Project',
        id,
        'Original Description',
        new Date('2023-01-01'),
        new Date('2023-01-01')
      );
      
      mockProjectRepo.findById.mockResolvedValue(existingProject);
      
      const updatedProject = new Project(
        dto.name,
        id,
        undefined,
        existingProject.createdDate,
        new Date()
      );
      
      mockProjectRepo.update.mockResolvedValue(updatedProject);

      const result = await useCase.execute(id, dto);

      expect(mockProjectRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          description: undefined
        })
      );
      
      expect(result).toEqual(updatedProject);
    });
  });
}); 