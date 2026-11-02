import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { ColumnNumericTransformer } from 'src/common/util/column-numeric-transformer.util';
import { DeliveryReceiptLineItem } from 'src/delivery-receipts/entities/delivery-receipt-line-item.entity';

@Entity()
export class PurchaseOrderLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
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

  @JoinColumn({ name: 'purchase_order_id' })
  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.lineItems)
  purchaseOrder: PurchaseOrder;

  @JoinColumn({ name: 'purchase_order_id' })
  @OneToMany(
    () => DeliveryReceiptLineItem,
    (deliveryReceiptLineItem) => deliveryReceiptLineItem.purchaseOrderLineItem,
  )
  deliveries: DeliveryReceiptLineItem[];
}
