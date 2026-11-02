import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { DeliveryState } from 'src/delivery-receipts/entities/delivery-states.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Invoice, DeliveryState])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
