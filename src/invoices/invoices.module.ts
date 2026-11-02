import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { DeliveryReceipt } from 'src/delivery-receipts/entities/delivery-receipt.entity';
import { JobOrder } from 'src/job-orders/entities/job-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, JobOrder, DeliveryReceipt])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
