import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DeliveryReceiptsService } from './delivery-receipts.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { DeliveryReceiptDto } from './dto/delivery-receipt.dto';
import { GetAllQueryDto } from 'src/common/dto/pagination-query.dto';
import { NotFoundException } from 'src/exceptions';
import { NotFoundException as HttpNotFoundException } from '@nestjs/common';
import { CreateDeliveryReceiptDto } from './dto/create-delivery-receipt.dto';
import { UpdateDeliveryReceiptDto } from './dto/update-delivery-receipt.dto';

@Controller('delivery-receipts')
export class DeliveryReceiptsController {
  constructor(readonly deliveryReceiptService: DeliveryReceiptsService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'List of delivery receipts',
    type: [DeliveryReceiptDto],
  })
  getDeliveryReceipts(
    @Query() { search, limit, offset }: GetAllQueryDto,
  ): Promise<DeliveryReceiptDto[]> {
    return this.deliveryReceiptService.getAll(search, { limit, offset });
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Delivery receipt details',
    type: DeliveryReceiptDto,
  })
  async getDeliveryReceipt(
    @Param('id') id: number,
  ): Promise<DeliveryReceiptDto> {
    try {
      return await this.deliveryReceiptService.get(id);
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
    description: 'Delivery receipt created successfully',
    type: DeliveryReceiptDto,
  })
  @ApiBody({ type: CreateDeliveryReceiptDto })
  createDeliveryReceipt(
    @Body() body: CreateDeliveryReceiptDto,
  ): Promise<DeliveryReceiptDto> {
    return this.deliveryReceiptService.create(body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Delivery receipt updated successfully',
    type: DeliveryReceiptDto,
  })
  @ApiBody({ type: UpdateDeliveryReceiptDto })
  updateDeliveryReceipt(
    @Param('id') id: number,
    @Body() body: UpdateDeliveryReceiptDto,
  ): Promise<DeliveryReceiptDto> {
    return this.deliveryReceiptService.update(id, body);
  }
}
