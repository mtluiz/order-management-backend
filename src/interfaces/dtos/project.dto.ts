export class CreateProjectDto {
  name: string;
  description?: string;
}

export class UpdateProjectDto {
  name: string;
  description?: string;
}

export class ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
}

export class ListProjectsQueryDto {
  skip?: number;
  take?: number;
  cursor?: string;
  orderBy?: string;
  name?: string;
  description?: string;
}

export class PaginatedProjectResponseDto {
  data: ProjectResponseDto[];
  total: number;
}
