import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateDeliveryReceiptLineItemDto {
  @ApiProperty({
    description: 'Quantity of the product delivered in line item',
  })
  @IsNumber()
  quantity: number;
}

export class UpdateDeliveryReceiptDto {
  @ApiProperty({
    description: 'Status of the delivery receipt',
    enum: ['New', 'Shipped', 'Delivered', 'Paid'],
  })
  @IsString()
  status: 'New' | 'Shipped' | 'Delivered' | 'Paid';
}
