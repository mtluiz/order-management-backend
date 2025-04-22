
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
