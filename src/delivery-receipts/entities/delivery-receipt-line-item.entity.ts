import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryReceipt } from './delivery-receipt.entity';
import { PurchaseOrderLineItem } from 'src/purchase-orders/entities/purchase-order-line-item.entity';

@Entity()
export class DeliveryReceiptLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'delivery_receipt_id' })
  @ManyToOne(
    () => DeliveryReceipt,
    (deliveryReceipt) => deliveryReceipt.lineItems,
  )
  deliveryReceipt: DeliveryReceipt;

  @JoinColumn({ name: 'purchase_order_line_item_id' })
  @ManyToOne(
    () => PurchaseOrderLineItem,
    (purchaseOrderLineItem) => purchaseOrderLineItem.deliveries,
  )
  purchaseOrderLineItem: PurchaseOrderLineItem;

  @Column()
  quantity: number;
}
