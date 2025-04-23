import { UpdateServiceOrderUseCase } from '@/application/use-cases/service-order/update-service-order.usecase';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { UpdateServiceOrderDto } from '@/interfaces/dtos/service-order.dto';

describe('UpdateServiceOrderUseCase', () => {
  let useCase: UpdateServiceOrderUseCase;
  let mockServiceOrderRepo: jest.Mocked<IServiceOrderRepository>;
  let originalDate: DateConstructor;
  let mockDate: Date;

  beforeEach(() => {
    mockServiceOrderRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByProject: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IServiceOrderRepository>;

    useCase = new UpdateServiceOrderUseCase(mockServiceOrderRepo);
    
    originalDate = global.Date;
    mockDate = new Date('2023-07-15T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  describe('execute', () => {
    it('should throw error if service order does not exist', async () => {
      const id = 'non-existent-id';
      const dto: UpdateServiceOrderDto = {
        name: 'Updated Service'
      };
      mockServiceOrderRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(id, dto)).rejects.toThrow('Service order not found');
      expect(mockServiceOrderRepo.findById).toHaveBeenCalledWith(id);
      expect(mockServiceOrderRepo.update).not.toHaveBeenCalled();
    });

    it('should update name when provided', async () => {
      const id = 'service-order-1';
      const dto: UpdateServiceOrderDto = {
        name: 'Updated Service'
      };
      
      const existingServiceOrder = new ServiceOrder(
        id,
        'Original Name',
        'Maintenance',
        'Description',
        'project-1',
        new Date('2023-01-01'),
        new Date('2023-01-01'),
        false
      );
      
      mockServiceOrderRepo.findById.mockResolvedValue(existingServiceOrder);
      
      const updatedServiceOrder = new ServiceOrder(
        id,
        dto.name!,
        existingServiceOrder.category,
        existingServiceOrder.description,
        existingServiceOrder.projectId,
        existingServiceOrder.createdDate,
        mockDate,
        existingServiceOrder.isApproved
      );
      
      mockServiceOrderRepo.update.mockResolvedValue(updatedServiceOrder);

      const result = await useCase.execute(id, dto);

      expect(mockServiceOrderRepo.findById).toHaveBeenCalledWith(id);
      expect(mockServiceOrderRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id,
          name: dto.name,
          updatedDate: mockDate
        })
      );
      
      expect(result).toEqual({
        id,
        name: dto.name,
        category: 'Maintenance',
        description: 'Description',
        projectId: 'project-1',
        createdDate: new Date('2023-01-01'),
        updatedDate: mockDate,
        isApproved: false,
        project: undefined
      });
    });

    it('should update all fields when provided', async () => {
      const id = 'service-order-1';
      const dto: UpdateServiceOrderDto = {
        name: 'Fully Updated Service',
        category: 'Installation',
        description: 'New Description',
        isApproved: true
      };
      
      const existingServiceOrder = new ServiceOrder(
        id,
        'Original Name',
        'Maintenance',
        'Description',
        'project-1',
        new Date('2023-01-01'),
        new Date('2023-01-01'),
        false
      );
      
      mockServiceOrderRepo.findById.mockResolvedValue(existingServiceOrder);
      
      const updatedServiceOrder = new ServiceOrder(
        id,
        dto.name!,
        dto.category!,
        dto.description!,
        existingServiceOrder.projectId,
        existingServiceOrder.createdDate,
        mockDate,
        dto.isApproved!
      );
      
      mockServiceOrderRepo.update.mockResolvedValue(updatedServiceOrder);

      const result = await useCase.execute(id, dto);

      expect(mockServiceOrderRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id,
          name: dto.name,
          category: dto.category,
          description: dto.description,
          isApproved: dto.isApproved,
          updatedDate: mockDate
        })
      );
      
      expect(result).toEqual({
        id,
        name: dto.name,
        category: dto.category,
        description: dto.description,
        projectId: 'project-1',
        createdDate: new Date('2023-01-01'),
        updatedDate: mockDate,
        isApproved: dto.isApproved,
        project: undefined
      });
    });
    
    it('should handle empty description as null', async () => {
      const id = 'service-order-1';
      const dto: UpdateServiceOrderDto = {
        description: ''
      };
      
      const existingServiceOrder = new ServiceOrder(
        id,
        'Original Name',
        'Maintenance',
        'Description',
        'project-1',
        new Date('2023-01-01'),
        new Date('2023-01-01'),
        false
      );
      
      mockServiceOrderRepo.findById.mockResolvedValue(existingServiceOrder);
      
      const updatedServiceOrder = new ServiceOrder(
        id,
        existingServiceOrder.name,
        existingServiceOrder.category,
        null,
        existingServiceOrder.projectId,
        existingServiceOrder.createdDate,
        mockDate,
        existingServiceOrder.isApproved
      );
      
      mockServiceOrderRepo.update.mockResolvedValue(updatedServiceOrder);

      const result = await useCase.execute(id, dto);

      expect(mockServiceOrderRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          description: null
        })
      );
      
      expect(result.description).toBeNull();
    });
  });
}); 