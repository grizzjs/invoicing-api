import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreatePurchaseOrderLineItemDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderDto {
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
    | 'Draft'
    | 'Finalized'
    | 'Approved'
    | 'Cancelled'
    | 'Pending'
    | 'Completed';
}

export class UpdatePurchaseOrderLineItemDto extends PartialType(
  CreatePurchaseOrderLineItemDto,
) {}
