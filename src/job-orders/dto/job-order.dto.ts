import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { InvoiceDto } from 'src/invoices/dto/invoice.dto';

export class JobOrderLineItemDto {
  @ApiProperty({ description: 'ID of the line item' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Name of the product in line item' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the product in line item',
    nullable: true,
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

export class JobOrderDto {
  @ApiProperty({ description: 'Unique identifier of the Job order' })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Status of the Job order',
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
    description: 'Notes for this Job order',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Customer associated with the Job order',
    type: () => CustomerDto,
  })
  customer: CustomerDto;

  @ApiPropertyOptional({
    description: 'Invoice associated with the Job order',
    type: () => InvoiceDto,
    nullable: true,
  })
  @IsOptional()
  invoice?: InvoiceDto;

  @ApiProperty({ description: 'Date the Job order was created' })
  @IsDate()
  createDate: Date;

  @ApiProperty({
    description: 'Line items in the Job order',
    type: [JobOrderLineItemDto],
  })
  lineItems: JobOrderLineItemDto[];
}
