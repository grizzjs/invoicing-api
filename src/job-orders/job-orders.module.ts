import { Module } from '@nestjs/common';
import { JobOrdersController } from './job-orders.controller';
import { JobOrdersService } from './job-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOrder } from './entities/job-order.entity';
import { JobOrderLineItem } from './entities/job-order-line-item.entity';
import { LineItemsController } from './line-items.controller';
import { LineItemsService } from './line-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobOrder, JobOrderLineItem])],
  controllers: [JobOrdersController, LineItemsController],
  providers: [JobOrdersService, LineItemsService],
})
export class JobOrdersModule {}
