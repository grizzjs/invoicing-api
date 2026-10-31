import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryReceipt } from './delivery-receipt.entity';

@Entity()
export class DeliveryState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: 'New' | 'Shipped' | 'Delivered' | 'Paid';

  @Column('jsonb', { nullable: true })
  details: any;

  @Column()
  date: Date;

  @JoinColumn({ name: 'delivery_receipt_id' })
  @ManyToOne(() => DeliveryReceipt, (deliveryReceipt) => deliveryReceipt.states)
  deliveryReceipt: DeliveryReceipt;
}
