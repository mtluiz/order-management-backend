import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      version: '1.0',
      description: 'Comprehensive API for managing service orders and projects',
      contact: {
        name: 'Matheus Luiz',
        email: 'matheusluizn@gmail.com',
      },
    };
  }
}
