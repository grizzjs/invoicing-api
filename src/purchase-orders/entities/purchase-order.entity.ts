import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrderLineItem } from './purchase-order-line-item.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({ name: 'create_date' })
  createDate: Date;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer)
  customer: Customer;

  @JoinColumn({ name: 'purchase_order_id' })
  @OneToMany(() => PurchaseOrderLineItem, (lineItem) => lineItem.purchaseOrder)
  lineItems: PurchaseOrderLineItem[];
}
