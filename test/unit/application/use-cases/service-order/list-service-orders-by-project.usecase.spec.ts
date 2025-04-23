import { ListServiceOrdersByProjectUseCase } from '@/application/use-cases/service-order/list-service-orders-by-project.usecase';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { Project } from '@/domain/entities/project.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

describe('ListServiceOrdersByProjectUseCase', () => {
  let useCase: ListServiceOrdersByProjectUseCase;
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

    useCase = new ListServiceOrdersByProjectUseCase(mockServiceOrderRepo, mockProjectRepo);
  });

  describe('execute', () => {
    it('should throw error if project does not exist', async () => {
      const projectId = 'non-existent-project';
      mockProjectRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(projectId)).rejects.toThrow('Project not found');
      expect(mockProjectRepo.findById).toHaveBeenCalledWith(projectId);
      expect(mockServiceOrderRepo.findByProject).not.toHaveBeenCalled();
    });

    it('should return paginated service orders for a project', async () => {
      const projectId = 'project-1';
      const mockProject = new Project('Project 1', projectId, 'Description', new Date(), new Date());
      
      mockProjectRepo.findById.mockResolvedValue(mockProject);
      
      const mockServiceOrders = [
        new ServiceOrder('1', 'Service 1', 'Maintenance', 'Description 1', projectId, new Date(), new Date(), false),
        new ServiceOrder('2', 'Service 2', 'Installation', 'Description 2', projectId, new Date(), new Date(), true),
      ];
      
      const mockResponse = {
        data: mockServiceOrders,
        total: 2
      };
      
      mockServiceOrderRepo.findByProject.mockResolvedValue(mockResponse);

      const result = await useCase.execute(projectId);

      expect(mockProjectRepo.findById).toHaveBeenCalledWith(projectId);
      expect(mockServiceOrderRepo.findByProject).toHaveBeenCalledWith(projectId, undefined);
      expect(result).toEqual({
        data: expect.any(Array),
        total: 2
      });
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('id', '1');
      expect(result.data[1]).toHaveProperty('id', '2');
    });

    it('should pass pagination parameters to repository', async () => {
      const projectId = 'project-1';
      const mockProject = new Project('Project 1', projectId, 'Description', new Date(), new Date());
      mockProjectRepo.findById.mockResolvedValue(mockProject);
      
      const mockParams = {
        skip: 0,
        take: 5,
        where: { category: 'Maintenance' },
        orderBy: { name: 'asc' }
      };
      
      const mockServiceOrders = [
        new ServiceOrder('1', 'Service 1', 'Maintenance', 'Description 1', projectId, new Date(), new Date(), false),
      ];
      
      const mockResponse = {
        data: mockServiceOrders,
        total: 1
      };
      
      mockServiceOrderRepo.findByProject.mockResolvedValue(mockResponse);

      const result = await useCase.execute(projectId, mockParams);

      expect(mockProjectRepo.findById).toHaveBeenCalledWith(projectId);
      expect(mockServiceOrderRepo.findByProject).toHaveBeenCalledWith(projectId, mockParams);
      expect(result).toEqual({
        data: expect.any(Array),
        total: 1
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('id', '1');
    });
  });
}); 