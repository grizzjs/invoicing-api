import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class CreatePurchaseOrderLineItemDto {
  @ApiProperty({ description: 'Name of the product in line item' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the product in line item',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantity of the product in line item' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Unit price of the product in line item' })
  @IsNumber()
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
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
  readonly status:
    | 'Draft'
    | 'Finalized'
    | 'Approved'
    | 'Cancelled'
    | 'Pending'
    | 'Completed';

  @ApiProperty({
    description: 'Customer associated with the purchase order',
  })
  @Type(() => PartialType(CustomerDto))
  @ValidateNested()
  readonly customer: Partial<CustomerDto>;

  @ApiProperty({ description: 'Date the purchase order was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiProperty({
    description: 'Line items of the purchase order',
    type: [CreatePurchaseOrderLineItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineItemDto)
  readonly lineItems: CreatePurchaseOrderLineItemDto[];
}
