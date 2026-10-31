import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryState } from './delivery-states.entity';
import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';
import { DeliveryReceiptLineItem } from './delivery-receipt-line-item.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Entity()
export class DeliveryReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_date' })
  createDate: Date;

  @Column({ name: 'status' })
  status: 'New' | 'Shipped' | 'Delivered' | 'Paid';

  @JoinColumn({ name: 'po_id' })
  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.deliveryReceipts,
  )
  purchaseOrder: PurchaseOrder;

  @JoinColumn({ name: 'delivery_receipt_id' })
  @OneToMany(
    () => DeliveryState,
    (deliveryState) => deliveryState.deliveryReceipt,
  )
  states: DeliveryState[];

  @JoinColumn({ name: 'delivery_receipt_id' })
  @OneToMany(
    () => DeliveryReceiptLineItem,
    (deliveryReceiptLineItem) => deliveryReceiptLineItem.deliveryReceipt,
  )
  lineItems: DeliveryReceiptLineItem[];

  @JoinColumn({ name: 'invoice_id' })
  @ManyToOne(() => Invoice, (invoice) => invoice.deliveryReceipts)
  invoice: Invoice;
}
