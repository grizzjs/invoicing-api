import { IsDate, IsString } from 'class-validator';

export class CreatePurchaseOrderLineItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  quantity: number;

  @IsString()
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
  @IsString()
  readonly status: string;

  @IsString()
  readonly customerId: number;

  @IsDate()
  readonly createDate: Date;

  readonly lineItems: CreatePurchaseOrderLineItemDto[];
}
