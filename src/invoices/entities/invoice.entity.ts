import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Customer } from 'src/customers/entities/customer.entity';
import { DeliveryReceipt } from 'src/delivery-receipts/entities/delivery-receipt.entity';
import { ColumnNumericTransformer } from 'src/common/util/column-numeric-transformer.util';
import { Collection } from 'src/collections/entities/collection.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_date' })
  createDate: Date;

  @Column()
  status: 'Unpaid' | 'Paid';

  @Column()
  term: 'Cash' | 'Charge';

  @Column({ name: 'due_in_days' })
  dueInDays: number;

  @Column('numeric', {
    name: 'amount',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'official_receipt', nullable: true })
  officialReceipt: number;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer)
  customer: Customer;

  @JoinColumn({ name: 'invoice_id' })
  @OneToMany(
    () => DeliveryReceipt,
    (deliveryReceipt) => deliveryReceipt.invoice,
  )
  deliveryReceipts: DeliveryReceipt[];

  @JoinColumn({ name: 'collection_id' })
  @ManyToOne(() => Collection)
  collection: Collection;
}
