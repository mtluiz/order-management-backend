import { Controller, Post, Get, Param, Body, Put, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CreateServiceOrderUseCase } from '@/application/use-cases/service-order/create-service-order.usecase';
import { ListServiceOrdersUseCase } from '@/application/use-cases/service-order/list-service-orders.usecase';
import { GetServiceOrderUseCase } from '@/application/use-cases/service-order/get-service-order.usecase';
import { UpdateServiceOrderUseCase } from '@/application/use-cases/service-order/update-service-order.usecase';
import { DeleteServiceOrderUseCase } from '@/application/use-cases/service-order/delete-service-order.usecase';
import { ListServiceOrdersByProjectUseCase } from '@/application/use-cases/service-order/list-service-orders-by-project.usecase';
import { 
  CreateServiceOrderDto, 
  ListServiceOrdersQueryDto, 
  PaginatedServiceOrderResponseDto, 
  ServiceOrderResponseDto, 
  UpdateServiceOrderDto 
} from '@/interfaces/dtos/service-order.dto';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/infrastructure/auth/guards/roles.guard';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';

@Controller('service-orders')
@UseGuards(JwtAuthGuard)
export class ServiceOrderController {
  constructor(
    private readonly createServiceOrder: CreateServiceOrderUseCase,
    private readonly listServiceOrders: ListServiceOrdersUseCase,
    private readonly getServiceOrder: GetServiceOrderUseCase,
    private readonly updateServiceOrder: UpdateServiceOrderUseCase,
    private readonly deleteServiceOrder: DeleteServiceOrderUseCase,
    private readonly listServiceOrdersByProject: ListServiceOrdersByProjectUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateServiceOrderDto): Promise<ServiceOrderResponseDto> {
    try {
      return await this.createServiceOrder.execute(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async list(
    @Query() query: ListServiceOrdersQueryDto
  ): Promise<PaginatedServiceOrderResponseDto> {
    try {
      const { skip, take, cursor, orderBy, name, category, description, isApproved, projectId } = query;
      
      const paginationParams = {
        skip: skip ? parseInt(String(skip), 10) : undefined,
        take: take ? parseInt(String(take), 10) : undefined,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: orderBy ? JSON.parse(orderBy) : undefined,
        where: {
          ...(name && { name: { contains: name } }),
          ...(category && { category: { contains: category } }),
          ...(description && { description: { contains: description } }),
          ...(isApproved !== undefined && { isApproved: isApproved }),
        }
      };
      
      if (projectId) {
        return await this.listServiceOrdersByProject.execute(projectId, paginationParams);
      }
      
      return await this.listServiceOrders.execute(paginationParams);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceOrderResponseDto> {
    try {
      return await this.getServiceOrder.execute(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateServiceOrderDto): Promise<ServiceOrderResponseDto> {
    try {
      return await this.updateServiceOrder.execute(id, body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteServiceOrder.execute(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  
  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async approve(@Param('id') id: string): Promise<ServiceOrderResponseDto> {
    try {
      const dto: UpdateServiceOrderDto = { isApproved: true };
      return await this.updateServiceOrder.execute(id, dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 