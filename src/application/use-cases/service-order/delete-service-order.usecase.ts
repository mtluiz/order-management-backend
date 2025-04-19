import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';

export class DeleteServiceOrderUseCase {
  constructor(private readonly serviceOrderRepo: IServiceOrderRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.serviceOrderRepo.findById(id);
    if (!existing) {
      throw new Error('Service order not found');
    }
    
    await this.serviceOrderRepo.delete(id);
  }
} 