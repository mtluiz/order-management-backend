import { ServiceOrder } from '@/domain/entities/service-order.entity';

export interface IServiceOrderRepository {
  create(serviceOrder: ServiceOrder): Promise<ServiceOrder>;
  findById(id: string): Promise<ServiceOrder | null>;
  findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: { id: string };
    where?: any;
    orderBy?: any;
  }): Promise<{ data: ServiceOrder[]; total: number }>;
  findByProject(
    projectId: string,
    params?: {
      skip?: number;
      take?: number;
      cursor?: { id: string };
      where?: any;
      orderBy?: any;
    }
  ): Promise<{ data: ServiceOrder[]; total: number }>;
  update(serviceOrder: ServiceOrder): Promise<ServiceOrder>;
  delete(id: string): Promise<void>;
} 