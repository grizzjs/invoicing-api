import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import {
  DeliveryReceiptDto,
  DeliveryReceiptLineItemDto,
} from 'src/delivery-receipts/dto/delivery-receipt.dto';

export class PurchaseOrderLineItemDto {
  @ApiProperty({ description: 'ID of the line item' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Name of the product in line item' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the product in line item' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantity of the product in line item' })
  @IsString()
  quantity: number;

  @ApiProperty({ description: 'Unit price of the product in line item' })
  @IsString()
  unitPrice: number;

  @ApiProperty({
    description: 'Delivery line items related to this purchase order line item',
    type: () => [DeliveryReceiptLineItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryReceiptLineItemDto)
  deliveries: DeliveryReceiptLineItemDto[];
}

export class PurchaseOrderDto {
  @ApiProperty({ description: 'Unique identifier of the purchase order' })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Status of the purchase order',
    enum: [
      'Draft',
      'Finalized',
      'Approved',
      'Cancelled',
      'Pending',
      'Completed',
    ],
  })
  @IsString()
  status:
    'Draft' | 'Finalized' | 'Approved' | 'Cancelled' | 'Pending' | 'Completed';

  @ApiPropertyOptional({
    description: 'Notes for this purchase order',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Customer associated with the purchase order',
    type: () => CustomerDto,
  })
  customer: CustomerDto;

  @ApiProperty({ description: 'Date the purchase order was created' })
  @IsDate()
  createDate: Date;

  @ApiProperty({
    description: 'Line items in the purchase order',
    type: [PurchaseOrderLineItemDto],
  })
  lineItems?: PurchaseOrderLineItemDto[];

  @ApiProperty({
    description: 'Delivery receipts associated with the purchase order',
    type: () => DeliveryReceiptDto,
    isArray: true,
  })
  deliveryReceipts: DeliveryReceiptDto[];
}
