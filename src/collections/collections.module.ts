import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    TypeOrmModule.forFeature([Invoice]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
