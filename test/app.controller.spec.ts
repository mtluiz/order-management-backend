import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@/infrastructure/http/controllers/app.controller';
import { AppService } from '@/application/services/app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return API information', () => {
      const expectedResponse = {
        version: '1.0',
        description: 'Comprehensive API for managing service orders and projects',
        contact: {
          name: 'Matheus Luiz',
          email: 'matheusluizn@gmail.com',
        },
      };
      
      expect(appController.getHello()).toEqual(expectedResponse);
    });
  });
});
