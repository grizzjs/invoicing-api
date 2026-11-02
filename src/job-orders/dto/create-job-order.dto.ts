import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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

export class CreateJobOrderLineItemDto {
  @ApiProperty({ description: 'Name of the service in line item' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the service in line item',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantity of the service in line item' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Unit price of the service in line item' })
  @IsNumber()
  unitPrice: number;
}

export class CreateJobOrderDto {
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
  readonly status:
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
  })
  @Type(() => PartialType(CustomerDto))
  @ValidateNested()
  readonly customer: Partial<CustomerDto>;

  @ApiProperty({ description: 'Date the Job order was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiProperty({
    description: 'Line items of the Job order',
    type: [CreateJobOrderLineItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobOrderLineItemDto)
  readonly lineItems: CreateJobOrderLineItemDto[];
}
