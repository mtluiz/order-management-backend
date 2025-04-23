import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaService) {}

  async create(project: Project): Promise<Project> {
    const data = await this.prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
      },
    });
    return new Project(data.name, data.id, data.description ?? undefined, data.createdDate, data.updatedDate);
  }

  async findById(id: string): Promise<Project | null> {
    const data = await this.prisma.project.findUnique({ where: { id } });
    return data ? new Project(data.name, data.id, data.description ?? undefined, data.createdDate, data.updatedDate) : null;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: { id: string };
    where?: any;
    orderBy?: any;
  }): Promise<{ data: Project[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params || {};
    
    const [list, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.project.count({ where })
    ]);
    
    return {
      data: list.map(p => new Project(p.name, p.id, p.description ?? undefined, p.createdDate, p.updatedDate)),
      total
    };
  }

  async update(project: Project): Promise<Project> {
    const data = await this.prisma.project.update({
      where: { id: project.id },
      data: {
        name: project.name,
        description: project.description,
      },
    });
    return new Project(data.name, data.id, data.description ?? undefined, data.createdDate, data.updatedDate);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
