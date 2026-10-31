import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { InvoiceDto } from 'src/invoices/dto/invoice.dto';

export class CollectionDto {
  @ApiProperty({
    description: 'Id of the collection',
  })
  id: number;

  @ApiProperty({
    description: 'Date of creation of the collection',
  })
  createDate: Date;

  @ApiProperty({
    description: 'Amount collected',
  })
  amount: number;

  @ApiProperty({
    description: 'Vat withheld from invoices',
  })
  vat: number;

  @ApiProperty({
    description: 'Notes for this collection',
  })
  notes: string;

  @ApiProperty({
    description: 'Customer associated with the collection',
    type: () => CustomerDto,
  })
  customer: CustomerDto;

  @ApiProperty({
    description: 'Invoices paid for this collection',
    type: () => [InvoiceDto],
  })
  invoices: InvoiceDto[];
}
