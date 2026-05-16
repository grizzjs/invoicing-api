import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { ColumnNumericTransformer } from 'src/common/util/column-numeric-transformer.util';

@Entity()
export class PurchaseOrderLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column('numeric', {
    name: 'unit_price',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  unitPrice: number;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.lineItems)
  purchaseOrder: PurchaseOrder;
}
