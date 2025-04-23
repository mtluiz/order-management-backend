import { DeleteServiceOrderUseCase } from '@/application/use-cases/service-order/delete-service-order.usecase';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';

describe('DeleteServiceOrderUseCase', () => {
  let useCase: DeleteServiceOrderUseCase;
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

    useCase = new DeleteServiceOrderUseCase(mockServiceOrderRepo);
  });

  describe('execute', () => {
    it('should throw error if service order does not exist', async () => {
      const id = 'non-existent-id';
      mockServiceOrderRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow('Service order not found');
      expect(mockServiceOrderRepo.findById).toHaveBeenCalledWith(id);
      expect(mockServiceOrderRepo.delete).not.toHaveBeenCalled();
    });

    it('should delete service order if it exists', async () => {
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
      mockServiceOrderRepo.delete.mockResolvedValue();

      await useCase.execute(id);

      expect(mockServiceOrderRepo.findById).toHaveBeenCalledWith(id);
      expect(mockServiceOrderRepo.delete).toHaveBeenCalledWith(id);
    });
  });
}); 