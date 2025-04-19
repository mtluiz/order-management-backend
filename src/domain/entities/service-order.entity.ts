import { Project } from './project.entity';

export class ServiceOrder {
  constructor(
    public readonly id: string,
    public name: string,
    public category: string,
    public description: string | null,
    public projectId: string,
    public createdDate: Date,
    public updatedDate: Date,
    public isApproved: boolean = false,
    public project?: Project
  ) {}
} 