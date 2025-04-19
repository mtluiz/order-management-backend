import { ServiceOrder } from '@/domain/entities/service-order.entity';

export interface IServiceOrderRepository {
  create(serviceOrder: ServiceOrder): Promise<ServiceOrder>;
  findById(id: string): Promise<ServiceOrder | null>;
  findAll(): Promise<ServiceOrder[]>;
  findByProject(projectId: string): Promise<ServiceOrder[]>;
  update(serviceOrder: ServiceOrder): Promise<ServiceOrder>;
  delete(id: string): Promise<void>;
} 