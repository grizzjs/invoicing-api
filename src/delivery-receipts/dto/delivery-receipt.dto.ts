import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  PurchaseOrderDto,
  PurchaseOrderLineItemDto,
} from 'src/purchase-orders/dto/purchase-order.dto';
import { InvoiceDto } from 'src/invoices/dto/invoice.dto';

export class DeliveryReceiptLineItemDto {
  @ApiProperty({
    description: 'Unique identifier of the delivery receipt line item',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Quantity of the product delivered in line item',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Purchase order line item delivered in line item',
    type: () => PurchaseOrderLineItemDto,
  })
  purchaseOrderLineItem: PurchaseOrderLineItemDto;

  @ApiProperty({
    description: 'Delivery receipt line item is associated with',
    type: () => DeliveryReceiptDto,
  })
  deliveryReceipt: any;
}

export class DeliveryStateDto {
  @ApiProperty({
    description: 'Unique identifier of the delivery receipt state',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Status of the delivery state',
    enum: ['New', 'Shipped', 'Delivered', 'Paid'],
  })
  @IsString()
  readonly status: 'New' | 'Shipped' | 'Delivered' | 'Paid';

  @ApiProperty({ description: 'Additional details of the delivery state' })
  @IsObject()
  readonly details: any;

  @ApiProperty({ description: 'Date the delivery receipt status was made' })
  @IsDate()
  readonly date: Date;
}

export class DeliveryReceiptDto {
  @ApiProperty({ description: 'Unique identifier of the delivery receipt' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Date the delivery receipt was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiProperty({
    description: 'Latest status of the delivery receipt',
    enum: ['New', 'Shipped', 'Delivered', 'Paid'],
  })
  @IsString()
  readonly status: 'New' | 'Shipped' | 'Delivered' | 'Paid';

  @ApiProperty({
    description: 'Purchase order associated with the delivery receipt',
    type: () => PurchaseOrderDto,
  })
  readonly purchaseOrder: PurchaseOrderDto;

  @ApiProperty({
    description: 'Notes for this delivery receipt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Status changes in the delivery receipt',
    type: () => [DeliveryStateDto],
  })
  states: DeliveryStateDto[];

  @ApiProperty({
    description: 'Delivery receipt line items',
    type: [DeliveryReceiptLineItemDto],
  })
  lineItems: DeliveryReceiptLineItemDto[];

  @ApiProperty({
    description: 'Invoice associated to the delivery receipt',
    type: () => InvoiceDto,
  })
  invoice: InvoiceDto;
}
