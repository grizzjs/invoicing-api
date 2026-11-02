import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    description: 'Date of creation of the collection',
  })
  @IsDate()
  createDate: Date;

  @ApiProperty({
    description: 'Amount collected',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Vat withheld from invoices',
  })
  @IsNumber()
  vat: number;

  @ApiPropertyOptional({
    description: 'Notes for this collection',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Customer associated with the collection',
  })
  @IsNumber()
  customer: number;

  @ApiProperty({
    description: 'Invoices paid for this collection',
    type: () => [Number],
  })
  @IsArray()
  invoices: number[];
}
