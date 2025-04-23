import { ListProjectsUseCase } from '@/application/use-cases/project/list-projects.usecase';
import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

describe('ListProjectsUseCase', () => {
  let useCase: ListProjectsUseCase;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    useCase = new ListProjectsUseCase(mockProjectRepo);
  });

  describe('execute', () => {
    it('should return paginated projects', async () => {
      const mockProjects = [
        new Project('Project 1', '1', 'Description 1', new Date(), new Date()),
        new Project('Project 2', '2', 'Description 2', new Date(), new Date()),
      ];
      
      const mockResponse = {
        data: mockProjects,
        total: 2
      };
      
      mockProjectRepo.findAll.mockResolvedValue(mockResponse);

      const result = await useCase.execute();

      expect(mockProjectRepo.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({
        data: expect.any(Array),
        total: 2
      });
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('id', '1');
      expect(result.data[1]).toHaveProperty('id', '2');
    });

    it('should pass pagination parameters to repository', async () => {
      const mockParams = {
        skip: 10,
        take: 5,
        where: { name: 'Project' },
        orderBy: { name: 'asc' }
      };
      
      const mockProjects = [
        new Project('Project 3', '3', 'Description 3', new Date(), new Date()),
      ];
      
      const mockResponse = {
        data: mockProjects,
        total: 1
      };
      
      mockProjectRepo.findAll.mockResolvedValue(mockResponse);

      const result = await useCase.execute(mockParams);

      expect(mockProjectRepo.findAll).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual({
        data: expect.any(Array),
        total: 1
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('id', '3');
    });
  });
}); 