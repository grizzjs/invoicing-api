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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LineItemsService } from './line-items.service';
import { DeliveryReceiptLineItemDto } from './dto/delivery-receipt.dto';
import { CreateDeliveryReceiptLineItemDto } from './dto/create-delivery-receipt.dto';
import { UpdateDeliveryReceiptLineItemDto } from './dto/update-delivery-receipt.dto';

@Controller('delivery-receipts/:deliveryReceiptId/line-items')
export class LineItemsController {
  constructor(private readonly lineItemService: LineItemsService) {}
  @Get('/')
  @ApiOkResponse({
    description: 'List of delivery receipt line items',
    type: DeliveryReceiptLineItemDto,
  })
  async getLineItemsByDeliveryReceipt(
    @Param('deliveryReceiptId') deliveryReceiptId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<DeliveryReceiptLineItemDto[]> {
    return this.lineItemService.getAll(deliveryReceiptId, pagination);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'List of delivery receipt line items',
    type: [DeliveryReceiptLineItemDto],
  })
  async getLineItemsByDeliveryReceiptAndId(
    @Param('deliveryReceiptId') deliveryReceiptId: number,
    @Param('id') id: number,
  ): Promise<DeliveryReceiptLineItemDto> {
    return this.lineItemService.get(deliveryReceiptId, id);
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Delivery receipt line item created successfully',
    type: DeliveryReceiptLineItemDto,
  })
  @ApiBody({ type: CreateDeliveryReceiptLineItemDto })
  async createDeliveryReceiptLineItem(
    @Param('deliveryReceiptId') deliveryReceiptId: number,
    @Body() body: CreateDeliveryReceiptLineItemDto,
  ): Promise<DeliveryReceiptLineItemDto> {
    return this.lineItemService.create(deliveryReceiptId, body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Delivery receipt line item created successfully',
    type: DeliveryReceiptLineItemDto,
  })
  @ApiBody({ type: UpdateDeliveryReceiptLineItemDto })
  async updateDeliveryReceiptLineItem(
    @Param('deliveryReceiptId') deliveryReceiptId: number,
    @Param('id') id: number,
    @Body() body: UpdateDeliveryReceiptLineItemDto,
  ): Promise<DeliveryReceiptLineItemDto> {
    return this.lineItemService.update(deliveryReceiptId, id, body);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Delivery receipt line item deleted successfully',
    type: DeliveryReceiptLineItemDto,
  })
  async deleteDeliveryReceiptLineItem(
    @Param('deliveryReceiptId') deliveryReceiptId: number,
    @Param('id') id: number,
  ): Promise<DeliveryReceiptLineItemDto> {
    return this.lineItemService.delete(deliveryReceiptId, id);
  }
}
