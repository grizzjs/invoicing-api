import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobOrder } from './job-order.entity';
import { ColumnNumericTransformer } from 'src/common/util/column-numeric-transformer.util';

@Entity()
export class JobOrderLineItem {
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

  @JoinColumn({ name: 'job_order_id' })
  @ManyToOne(() => JobOrder, (jobOrder) => jobOrder.lineItems)
  jobOrder: JobOrder;
}
