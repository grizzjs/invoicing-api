import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Date the delivery receipt was created' })
  @IsDate()
  readonly createDate: Date;

  @ApiProperty({ description: 'The number of days the invoice will be due.' })
  @IsNumber()
  readonly dueInDays: number;

  @ApiPropertyOptional({
    description: 'Notes for this invoice',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Delivery receipts associated with the invoice',
    type: () => [Number],
  })
  @IsArray()
  deliveryReceipts: number[];
}
