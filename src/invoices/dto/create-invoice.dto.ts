import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Date the delivery receipt was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiProperty({ description: 'The number of days the invoice will be due.' })
  @IsNumber()
  readonly dueInDays: number;

  @ApiProperty({
    description: 'Delivery receipts associated with the invoice',
    type: () => [Number],
  })
  @IsArray()
  deliveryReceipts: number[];
}
