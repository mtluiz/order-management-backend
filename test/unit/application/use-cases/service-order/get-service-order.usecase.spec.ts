import { GetServiceOrderUseCase } from '@/application/use-cases/service-order/get-service-order.usecase';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';

describe('GetServiceOrderUseCase', () => {
  let useCase: GetServiceOrderUseCase;
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

    useCase = new GetServiceOrderUseCase(mockServiceOrderRepo);
  });

  describe('execute', () => {
    it('should throw error if service order does not exist', async () => {
      const id = 'non-existent-id';
      mockServiceOrderRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow('Service order not found');
      expect(mockServiceOrderRepo.findById).toHaveBeenCalledWith(id);
    });

    it('should return service order if it exists', async () => {
      const id = 'service-order-1';
      const mockServiceOrder = new ServiceOrder(
        id,
        'Service 1',
        'Maintenance',
        'Description',
        'project-1',
        new Date(),
        new Date(),
        false
      );
      
      mockServiceOrderRepo.findById.mockResolvedValue(mockServiceOrder);

      const result = await useCase.execute(id);

      expect(mockServiceOrderRepo.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        id,
        name: 'Service 1',
        category: 'Maintenance',
        description: 'Description',
        projectId: 'project-1',
        createdDate: expect.any(Date),
        updatedDate: expect.any(Date),
        isApproved: false,
        project: undefined
      });
    });
  });
}); 