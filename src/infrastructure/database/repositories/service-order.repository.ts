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

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: { id: string };
    where?: any;
    orderBy?: any;
  }): Promise<{ data: ServiceOrder[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params || {};
    
    const [list, total] = await Promise.all([
      this.prisma.serviceOrder.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          project: true
        }
      }),
      this.prisma.serviceOrder.count({ where })
    ]);

    return {
      data: list.map(item => this.mapToEntity(item)),
      total
    };
  }

  async findByProject(
    projectId: string,
    params?: {
      skip?: number;
      take?: number;
      cursor?: { id: string };
      where?: any;
      orderBy?: any;
    }
  ): Promise<{ data: ServiceOrder[]; total: number }> {
    const { skip, take, cursor, where = {}, orderBy } = params || {};
    
    // Combine the project filter with any additional where conditions
    const combinedWhere = {
      ...where,
      projectId
    };
    
    const [list, total] = await Promise.all([
      this.prisma.serviceOrder.findMany({
        skip,
        take,
        cursor,
        where: combinedWhere,
        orderBy,
        include: {
          project: true
        }
      }),
      this.prisma.serviceOrder.count({ where: combinedWhere })
    ]);

    return {
      data: list.map(item => this.mapToEntity(item)),
      total
    };
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
        data.project.name,
        data.project.id, 
        data.project.description || undefined,
        data.project.createdDate,
        data.project.updatedDate
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