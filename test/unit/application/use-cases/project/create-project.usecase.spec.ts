import { CreateProjectUseCase } from '@/application/use-cases/project/create-project.usecase';
import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { CreateProjectDto } from '@/interfaces/dtos/project.dto';

describe('CreateProjectUseCase', () => {
  let useCase: CreateProjectUseCase;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    useCase = new CreateProjectUseCase(mockProjectRepo);
  });

  describe('execute', () => {
    it('should create a project', async () => {
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);
      
      const dto: CreateProjectDto = {
        name: 'New Project',
        description: 'Description'
      };
      
      const createdProject = new Project(
        dto.name,
        'generated-id',
        dto.description,
        now,
        now
      );
      
      mockProjectRepo.create.mockResolvedValue(createdProject);

      const result = await useCase.execute(dto);

      expect(mockProjectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          description: dto.description
        })
      );
      
      expect(result).toEqual(createdProject);
    });

    it('should handle project without description', async () => {
      const dto: CreateProjectDto = {
        name: 'New Project'
      };
      
      const createdProject = new Project(
        dto.name,
        'generated-id',
        '',
        new Date(),
        new Date()
      );
      
      mockProjectRepo.create.mockResolvedValue(createdProject);

      const result = await useCase.execute(dto);

      expect(mockProjectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          description: ''
        })
      );
      
      expect(result).toEqual(createdProject);
    });
  });
}); 