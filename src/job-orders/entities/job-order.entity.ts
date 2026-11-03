import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { JobOrderLineItem } from './job-order-line-item.entity';

@Entity()
export class JobOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status:
    'Draft' | 'Finalized' | 'Approved' | 'Cancelled' | 'Pending' | 'Completed';

  @Column({ name: 'create_date' })
  createDate: Date;

  @Column({ nullable: true })
  notes: string;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer)
  customer: Customer;

  @JoinColumn({ name: 'invoice_id' })
  @ManyToOne(() => Invoice, (invoice) => invoice.jobOrders)
  invoice: Invoice;

  @OneToMany(() => JobOrderLineItem, (lineItem) => lineItem.jobOrder)
  lineItems: JobOrderLineItem[];
}
