import { Module } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { ProjectRepository } from '@/infrastructure/database/repositories/project.repository';
import { CreateProjectUseCase } from '@/application/use-cases/project/create-project.usecase';
import { ListProjectsUseCase } from '@/application/use-cases/project/list-projects.usecase';
import { GetProjectUseCase } from '@/application/use-cases/project/get-project.usecase';
import { UpdateProjectUseCase } from '@/application/use-cases/project/update-project.usecase';
import { DeleteProjectUseCase } from '@/application/use-cases/project/delete-project.usecase';
import { ProjectController } from '../controllers/project.controller';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [
    PrismaService,
    ProjectRepository,
    {
      provide: CreateProjectUseCase,
      useFactory: (repo: ProjectRepository) => new CreateProjectUseCase(repo),
      inject: [ProjectRepository],
    },
    {
      provide: ListProjectsUseCase,
      useFactory: (repo: ProjectRepository) => new ListProjectsUseCase(repo),
      inject: [ProjectRepository],
    },
    {
      provide: GetProjectUseCase,
      useFactory: (repo: ProjectRepository) => new GetProjectUseCase(repo),
      inject: [ProjectRepository],
    },
    {
      provide: UpdateProjectUseCase,
      useFactory: (repo: ProjectRepository) => new UpdateProjectUseCase(repo),
      inject: [ProjectRepository],
    },
    {
      provide: DeleteProjectUseCase,
      useFactory: (repo: ProjectRepository) => new DeleteProjectUseCase(repo),
      inject: [ProjectRepository],
    },
  ],
})
export class ProjectModule {}
