import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { InvoiceDto } from 'src/invoices/dto/invoice.dto';

export class CustomerDto {
  @ApiProperty({ description: 'Unique identifier of the customer' })
  readonly id: number;

  @ApiProperty({ description: 'Name of the customer' })
  readonly name: string;

  @ApiProperty({ description: 'Address of the customer' })
  readonly address: string;

  @ApiProperty({ description: 'Phone number of the customer' })
  readonly phoneNumber: string;

  @ApiProperty({ description: 'Email of the customer' })
  readonly email: string;

  @ApiProperty({
    description: 'Taxpayer Identification Number of the customer',
  })
  readonly tin: string;

  @ApiProperty({
    description: 'Notes for this customer',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Outstanding invoices of the customer',
    type: () => [InvoiceDto],
  })
  readonly invoices: InvoiceDto[];
}
