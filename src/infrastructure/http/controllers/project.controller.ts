import { Controller, Post, Get, Param, Body, Put, Delete, HttpException, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { CreateProjectUseCase } from '@/application/use-cases/project/create-project.usecase';
import { ListProjectsUseCase } from '@/application/use-cases/project/list-projects.usecase';
import { GetProjectUseCase } from '@/application/use-cases/project/get-project.usecase';
import { UpdateProjectUseCase } from '@/application/use-cases/project/update-project.usecase';
import { DeleteProjectUseCase } from '@/application/use-cases/project/delete-project.usecase';
import { CreateProjectDto, PaginatedProjectResponseDto, ProjectResponseDto, UpdateProjectDto, ListProjectsQueryDto } from '@/interfaces/dtos/project.dto';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/infrastructure/auth/guards/roles.guard';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly listProjects: ListProjectsUseCase,
    private readonly getProject: GetProjectUseCase,
    private readonly updateProject: UpdateProjectUseCase,
    private readonly deleteProject: DeleteProjectUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateProjectDto): Promise<ProjectResponseDto> {
    try {
      return await this.createProject.execute(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async list(@Query() query: ListProjectsQueryDto): Promise<PaginatedProjectResponseDto> {
    try {
      const { skip, take, cursor, orderBy, name, description } = query;
      
      return await this.listProjects.execute({
        skip: skip ? parseInt(String(skip), 10) : undefined,
        take: take ? parseInt(String(take), 10) : undefined,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: orderBy ? JSON.parse(orderBy) : undefined,
        where: {
          ...(name && { name: { contains: name } }),
          ...(description && { description: { contains: description } }),
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    try {
      return await this.getProject.execute(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto): Promise<ProjectResponseDto> {
    try {
      return await this.updateProject.execute(id, body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteProject.execute(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
