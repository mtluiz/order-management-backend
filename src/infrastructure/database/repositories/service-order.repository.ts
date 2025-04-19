import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { ServiceOrder } from '@/domain/entities/service-order.entity';
import { IServiceOrderRepository } from '@/domain/repositories/service-order.repository.interface';
import { Project } from '@/domain/entities/project.entity';

@Injectable()
export class ServiceOrderRepository implements IServiceOrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(serviceOrder: ServiceOrder): Promise<ServiceOrder> {
    const data = await this.prisma.serviceOrder.create({
      data: {
        id: serviceOrder.id,
        name: serviceOrder.name,
        category: serviceOrder.category,
        description: serviceOrder.description,
        projectId: serviceOrder.projectId,
        createdDate: serviceOrder.createdDate,
        updatedDate: serviceOrder.updatedDate,
        isApproved: serviceOrder.isApproved
      },
      include: {
        project: true
      }
    });

    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    const data = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        project: true
      }
    });

    return data ? this.mapToEntity(data) : null;
  }

  async findAll(): Promise<ServiceOrder[]> {
    const list = await this.prisma.serviceOrder.findMany({
      include: {
        project: true
      }
    });

    return list.map(item => this.mapToEntity(item));
  }

  async findByProject(projectId: string): Promise<ServiceOrder[]> {
    const list = await this.prisma.serviceOrder.findMany({
      where: { projectId },
      include: {
        project: true
      }
    });

    return list.map(item => this.mapToEntity(item));
  }

  async update(serviceOrder: ServiceOrder): Promise<ServiceOrder> {
    const data = await this.prisma.serviceOrder.update({
      where: { id: serviceOrder.id },
      data: {
        name: serviceOrder.name,
        category: serviceOrder.category,
        description: serviceOrder.description,
        updatedDate: serviceOrder.updatedDate,
        isApproved: serviceOrder.isApproved
      },
      include: {
        project: true
      }
    });

    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.serviceOrder.delete({ where: { id } });
  }

  private mapToEntity(data: any): ServiceOrder {
    let project: Project | undefined;
    
    if (data.project) {
      project = new Project(
        data.project.id, 
        data.project.name, 
        data.project.description || undefined
      );
    }
    
    return new ServiceOrder(
      data.id,
      data.name,
      data.category,
      data.description || null,
      data.projectId,
      data.createdDate,
      data.updatedDate,
      data.isApproved,
      project
    );
  }
} 