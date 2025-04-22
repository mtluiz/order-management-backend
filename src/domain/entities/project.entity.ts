export class Project {
    constructor(
      public name: string,
      public readonly id: string,
      public description?: string,
      public readonly createdDate?: Date | null,
      public readonly updatedDate?: Date | null,
    ) {
    }
  }
  