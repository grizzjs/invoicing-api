import { Invoice } from 'src/invoices/entities/invoice.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  tin: string;

  @JoinColumn({ name: 'customer_id' })
  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  static of(id: number): Customer {
    const customer = new Customer();
    customer.id = id;
    return customer;
  }
}
