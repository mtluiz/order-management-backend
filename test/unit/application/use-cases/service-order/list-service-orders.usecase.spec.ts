import { ListServiceOrdersUseCase } from '@/application/use-cases/service-order/list-service-orders.usecase';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';

describe('ListServiceOrdersUseCase', () => {
  let useCase: ListServiceOrdersUseCase;
  let mockServiceOrderRepo: jest.Mocked<IServiceOrderRepository>;

  beforeEach(() => {
    mockServiceOrderRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByProject: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IServiceOrderRepository>;

    useCase = new ListServiceOrdersUseCase(mockServiceOrderRepo);
  });

  describe('execute', () => {
    it('should return paginated service orders', async () => {
      const mockServiceOrders = [
        new ServiceOrder('1', 'Service 1', 'Maintenance', 'Description 1', 'project-1', new Date(), new Date(), false),
        new ServiceOrder('2', 'Service 2', 'Installation', 'Description 2', 'project-2', new Date(), new Date(), true),
      ];
      
      const mockResponse = {
        data: mockServiceOrders,
        total: 2
      };
      
      mockServiceOrderRepo.findAll.mockResolvedValue(mockResponse);

      const result = await useCase.execute();

      expect(mockServiceOrderRepo.findAll).toHaveBeenCalledWith(undefined);
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
        where: { category: 'Maintenance' },
        orderBy: { name: 'asc' }
      };
      
      const mockServiceOrders = [
        new ServiceOrder('3', 'Service 3', 'Maintenance', 'Description 3', 'project-3', new Date(), new Date(), false),
      ];
      
      const mockResponse = {
        data: mockServiceOrders,
        total: 1
      };
      
      mockServiceOrderRepo.findAll.mockResolvedValue(mockResponse);

      const result = await useCase.execute(mockParams);

      expect(mockServiceOrderRepo.findAll).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual({
        data: expect.any(Array),
        total: 1
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('id', '3');
    });
  });
}); 