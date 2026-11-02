import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CollectionDto } from 'src/collections/dto/collection.dto';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { DeliveryReceiptDto } from 'src/delivery-receipts/dto/delivery-receipt.dto';
import { JobOrderDto } from 'src/job-orders/dto/job-order.dto';

export class InvoiceDto {
  @ApiProperty({ description: 'Unique identifier of the invoice' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Date the delivery receipt was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: ['Unpaid', 'Paid'],
  })
  @IsString()
  readonly status: 'Unpaid' | 'Paid';

  @ApiProperty({
    description: 'The type of term the invoice is',
    enum: ['Cash', 'Charge'],
  })
  @IsString()
  readonly term: 'Cash' | 'Charge';

  @ApiProperty({ description: 'The number of days the invoice will be due.' })
  @IsNumber()
  readonly dueInDays: number;

  @ApiProperty({ description: 'The amount of the invoice' })
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ description: 'The official receipt number of the invoice' })
  readonly officialReceipt: number;

  @ApiProperty({
    description: 'Notes for this invoice',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Customer associated with the invoice',
    type: () => CustomerDto,
  })
  readonly customer: CustomerDto;

  @ApiPropertyOptional({
    description: 'Delivery receipts associated with the invoice',
    type: [DeliveryReceiptDto],
  })
  deliveryReceipts?: DeliveryReceiptDto[];

  @ApiProperty({
    description: 'Collection associated with the invoice',
    type: () => CollectionDto,
  })
  readonly collection: CollectionDto;

  @ApiPropertyOptional({
    description: 'Job orders associated with the invoice',
    type: [JobOrderDto],
  })
  jobOrders?: JobOrderDto[];
}
