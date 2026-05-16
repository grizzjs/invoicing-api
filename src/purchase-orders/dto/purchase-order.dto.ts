import { IsDate, IsNumber, IsString } from 'class-validator';
import { CustomerDto } from 'src/customers/dto/customer.dto';

export class PurchaseOrderLineItemDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  quantity: number;

  @IsString()
  unitPrice: number;
}

export class PurchaseOrderDto {
  @IsNumber()
  id: number;

  @IsString()
  status: string;

  customer: CustomerDto;

  @IsDate()
  createDate: Date;

  lineItems: PurchaseOrderLineItemDto[];
}
