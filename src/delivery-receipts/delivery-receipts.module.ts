import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryReceipt } from './entities/delivery-receipt.entity';
import { DeliveryState } from './entities/delivery-states.entity';
import { DeliveryReceiptLineItem } from './entities/delivery-receipt-line-item.entity';
import { DeliveryReceiptsController } from './delivery-receipts.controller';
import { DeliveryReceiptsService } from './delivery-receipts.service';
import { LineItemsController } from './line-items.controller';
import { LineItemsService } from './line-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryReceipt,
      DeliveryState,
      DeliveryReceiptLineItem,
    ]),
  ],
  controllers: [DeliveryReceiptsController, LineItemsController],
  providers: [DeliveryReceiptsService, LineItemsService],
})
export class DeliveryReceiptsModule {}
