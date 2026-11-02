import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PurchaseOrderLineItemDto } from './dto/purchase-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LineItemsService } from './line-items.service';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order.dto';

@Controller('purchase-orders/:purchaseOrderId/line-items')
export class LineItemsController {
  constructor(private readonly lineItemService: LineItemsService) {}
  @Get('/')
  @ApiOkResponse({
    description: 'List of purchase orders line items',
    type: PurchaseOrderLineItemDto,
  })
  async getLineItemsByPurchaseOrder(
    @Param('purchaseOrderId') purchaseOrderId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PurchaseOrderLineItemDto[]> {
    return this.lineItemService.getAll(purchaseOrderId, pagination);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'List of purchase orders line items',
    type: [PurchaseOrderLineItemDto],
  })
  async getLineItemsByPurchaseOrderAndId(
    @Param('purchaseOrderId') purchaseOrderId: number,
    @Param('id') id: number,
  ): Promise<PurchaseOrderLineItemDto> {
    return this.lineItemService.get(purchaseOrderId, id);
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Purchase order line item created successfully',
    type: PurchaseOrderLineItemDto,
  })
  @ApiBody({ type: CreatePurchaseOrderLineItemDto })
  async createPurchaseOrderLineItem(
    @Param('purchaseOrderId') purchaseOrderId: number,
    @Body() body: CreatePurchaseOrderLineItemDto,
  ): Promise<PurchaseOrderLineItemDto> {
    return this.lineItemService.create(purchaseOrderId, body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Purchase order line item created successfully',
    type: PurchaseOrderLineItemDto,
  })
  @ApiBody({ type: UpdatePurchaseOrderLineItemDto })
  async updatePurchaseOrderLineItem(
    @Param('purchaseOrderId') purchaseOrderId: number,
    @Param('id') id: number,
    @Body() body: UpdatePurchaseOrderLineItemDto,
  ): Promise<PurchaseOrderLineItemDto> {
    return this.lineItemService.update(purchaseOrderId, id, body);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Purchase order line item deleted successfully',
    type: PurchaseOrderLineItemDto,
  })
  async deletePurchaseOrderLineItem(
    @Param('purchaseOrderId') purchaseOrderId: number,
    @Param('id') id: number,
  ): Promise<PurchaseOrderLineItemDto> {
    return this.lineItemService.delete(purchaseOrderId, id);
  }
}
