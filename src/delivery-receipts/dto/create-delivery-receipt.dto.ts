import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  PurchaseOrderDto,
  PurchaseOrderLineItemDto,
} from 'src/purchase-orders/dto/purchase-order.dto';

export class CreateDeliveryReceiptLineItemDto {
  @ApiProperty({
    description: 'Quantity of the product delivered in line item',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Purchase order line item delivered in line item',
  })
  @Type(() => PartialType(PurchaseOrderLineItemDto))
  @ValidateNested()
  purchaseOrderLineItem: Partial<PurchaseOrderLineItemDto>;
}

export class CreateDeliveryStateDto {
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

  @ApiProperty({ description: 'Id of the delivery receipt' })
  @IsString()
  readonly deliveryReceiptId: number;
}

export class CreateDeliveryReceiptDto {
  @ApiProperty({
    description:
      'ID of the purchase order associated with the delivery receipt',
  })
  @ValidateNested()
  @Type(() => PartialType(PurchaseOrderDto))
  readonly purchaseOrder: Partial<PurchaseOrderDto>;

  @ApiProperty({ description: 'Date the delivery receipt was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiPropertyOptional({
    description: 'Notes for this delivery receipt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Line items of the delivery receipt',
    type: [CreateDeliveryReceiptLineItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryReceiptLineItemDto)
  readonly lineItems: CreateDeliveryReceiptLineItemDto[];
}
