import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { UpdateServiceOrderDto, ServiceOrderResponseDto } from '@/interfaces/dtos/service-order.dto';

export class UpdateServiceOrderUseCase {
  constructor(private readonly serviceOrderRepo: IServiceOrderRepository) {}

  async execute(id: string, dto: UpdateServiceOrderDto): Promise<ServiceOrderResponseDto> {
    const existing = await this.serviceOrderRepo.findById(id);
    if (!existing) {
      throw new Error('Service order not found');
    }
    
    // Update only provided fields
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.category !== undefined) existing.category = dto.category;
    if (dto.description !== undefined) existing.description = dto.description === '' ? null : dto.description;
    if (dto.isApproved !== undefined) existing.isApproved = dto.isApproved;
    
    // Always update the updatedDate
    existing.updatedDate = new Date();
    
    const updated = await this.serviceOrderRepo.update(existing);
    return ServiceOrderResponseDto.fromEntity(updated);
  }
} 