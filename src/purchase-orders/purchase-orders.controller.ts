import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { GetAllQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { NotFoundException as HttpNotFoundException } from '@nestjs/common';
import { NotFoundException } from 'src/exceptions';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'List of purchase orders',
    type: [PurchaseOrderDto],
  })
  async getPurchaseOrders(
    @Query() { search, limit, offset }: GetAllQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PurchaseOrderDto[]> {
    const count = await this.purchaseOrdersService.getCount();
    const all = this.purchaseOrdersService.getAll(search, { limit, offset });
    res.set('X-Total-Count', count.toString());
    return all;
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Purchase order details',
    type: PurchaseOrderDto,
  })
  async getPurchaseOrder(@Param('id') id: number): Promise<PurchaseOrderDto> {
    try {
      return await this.purchaseOrdersService.get(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new HttpNotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Purchase order created successfully',
    type: PurchaseOrderDto,
  })
  @ApiBody({ type: CreatePurchaseOrderDto })
  createPurchaseOrder(
    @Body() body: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrderDto> {
    return this.purchaseOrdersService.create(body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Purchase order updated successfully',
    type: PurchaseOrderDto,
  })
  @ApiBody({ type: UpdatePurchaseOrderDto })
  updatePurchaseOrder(
    @Param('id') id: number,
    @Body() body: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderDto> {
    return this.purchaseOrdersService.update(id, body);
  }
}
