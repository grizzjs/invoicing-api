import { ColumnNumericTransformer } from 'src/common/util/column-numeric-transformer.util';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_date' })
  createDate: Date;

  @Column('numeric', {
    name: 'amount',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column()
  vat: number;

  @Column({ nullable: true })
  notes: string;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer)
  customer: Customer;

  @JoinColumn({ name: 'collection_id' })
  @OneToMany(() => Invoice, (invoice) => invoice.collection)
  invoices: Invoice[];
}
