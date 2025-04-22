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

  async findAll(): Promise<Project[]> {
    const list = await this.prisma.project.findMany();
    console.log('list', list);
    return list.map(p => new Project(p.name, p.id, p.description ?? undefined, p.createdDate, p.updatedDate));
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
