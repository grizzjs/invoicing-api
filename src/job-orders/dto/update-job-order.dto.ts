import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateJobOrderLineItemDto } from './create-job-order.dto';
import { InvoiceDto } from 'src/invoices/dto/invoice.dto';
import { Type } from 'class-transformer';

export class UpdateJobOrderDto {
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
  notes: string;

  @ApiPropertyOptional({
    description: 'Invoice associated with the Job order',
    nullable: true,
  })
  @IsOptional()
  @Type(() => PartialType(InvoiceDto))
  @ValidateNested()
  readonly invoice?: Partial<InvoiceDto>;
  
}

export class UpdateJobOrderLineItemDto extends PartialType(
  CreateJobOrderLineItemDto,
) {}
