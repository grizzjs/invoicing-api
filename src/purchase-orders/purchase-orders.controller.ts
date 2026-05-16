import { Controller, Get, Param, Query } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get('/')
  getPurchaseOrders(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PurchaseOrderDto[]> {
    return this.purchaseOrdersService.getAll(pagination);
  }

  @Get('/:id')
  getPurchaseOrder(@Param('id') id: number): Promise<PurchaseOrderDto> {
    return this.purchaseOrdersService.get(id);
  }
}
