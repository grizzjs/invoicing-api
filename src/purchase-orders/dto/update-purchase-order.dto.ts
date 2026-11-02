import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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
    'Draft' | 'Finalized' | 'Approved' | 'Cancelled' | 'Pending' | 'Completed';

  @ApiPropertyOptional({
    description: 'Notes for this purchase order',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;
}

export class UpdatePurchaseOrderLineItemDto extends PartialType(
  CreatePurchaseOrderLineItemDto,
) {}
