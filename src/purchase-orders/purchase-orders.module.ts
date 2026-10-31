import { Module } from '@nestjs/common';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { LineItemsController } from './line-items.controller';
import { LineItemsService } from './line-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderLineItem])],
  controllers: [PurchaseOrdersController, LineItemsController],
  providers: [PurchaseOrdersService, LineItemsService],
})
export class PurchaseOrdersModule {}
