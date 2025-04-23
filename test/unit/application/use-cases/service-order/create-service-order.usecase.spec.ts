import { CreateServiceOrderUseCase } from '@/application/use-cases/service-order/create-service-order.usecase';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { Project } from '@/domain/entities/project.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { CreateServiceOrderDto } from '@/interfaces/dtos/service-order.dto';

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('CreateServiceOrderUseCase', () => {
  let useCase: CreateServiceOrderUseCase;
  let mockServiceOrderRepo: jest.Mocked<IServiceOrderRepository>;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockServiceOrderRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByProject: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IServiceOrderRepository>;

    mockProjectRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    useCase = new CreateServiceOrderUseCase(mockServiceOrderRepo, mockProjectRepo);
  });

  describe('execute', () => {
    it('should throw error if project does not exist', async () => {
      const dto: CreateServiceOrderDto = {
        name: 'New Service',
        category: 'Maintenance',
        description: 'Description',
        projectId: 'non-existent-project',
      };
      mockProjectRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow('Project not found');
      expect(mockProjectRepo.findById).toHaveBeenCalledWith(dto.projectId);
      expect(mockServiceOrderRepo.create).not.toHaveBeenCalled();
    });

    it('should create a service order if project exists', async () => {
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);
      
      const dto: CreateServiceOrderDto = {
        name: 'New Service',
        category: 'Maintenance',
        description: 'Description',
        projectId: 'project-1',
      };
      
      const mockProject = new Project('Project 1', dto.projectId, 'Description', now, now);
      mockProjectRepo.findById.mockResolvedValue(mockProject);
      
      const expectedServiceOrder = new ServiceOrder(
        'mocked-uuid',
        dto.name,
        dto.category,
        dto.description || null,
        dto.projectId,
        now,
        now,
        false,
        mockProject
      );
      
      mockServiceOrderRepo.create.mockResolvedValue(expectedServiceOrder);

      const result = await useCase.execute(dto);

      expect(mockProjectRepo.findById).toHaveBeenCalledWith(dto.projectId);
      expect(mockServiceOrderRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mocked-uuid',
          name: dto.name,
          category: dto.category,
          description: dto.description,
          projectId: dto.projectId,
          createdDate: now,
          updatedDate: now,
          isApproved: false
        })
      );
      
      expect(result).toEqual({
        id: 'mocked-uuid',
        name: dto.name,
        category: dto.category,
        description: dto.description,
        projectId: dto.projectId,
        createdDate: now,
        updatedDate: now,
        isApproved: false,
        project: mockProject
      });
    });

    it('should handle optional description field', async () => {
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);
      
      const dto: CreateServiceOrderDto = {
        name: 'New Service',
        category: 'Maintenance',
        projectId: 'project-1',
      };
      
      const mockProject = new Project('Project 1', dto.projectId, 'Description', now, now);
      mockProjectRepo.findById.mockResolvedValue(mockProject);
      
      const expectedServiceOrder = new ServiceOrder(
        'mocked-uuid',
        dto.name,
        dto.category,
        null,
        dto.projectId,
        now,
        now,
        false,
        mockProject
      );
      
      mockServiceOrderRepo.create.mockResolvedValue(expectedServiceOrder);

      const result = await useCase.execute(dto);

      expect(mockServiceOrderRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: null
        })
      );
      
      expect(result.description).toBeNull();
    });
  });
}); 