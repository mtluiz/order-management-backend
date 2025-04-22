export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public name: string,
    public role: string = 'user',
    public readonly createdDate: Date = new Date(),
    public readonly updatedDate: Date = new Date()
  ) {}
} 