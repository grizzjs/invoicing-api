import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { NotFoundException } from 'src/exceptions';
import { DeliveryReceiptLineItem } from './entities/delivery-receipt-line-item.entity';
import { UpdateDeliveryReceiptLineItemDto } from './dto/update-delivery-receipt.dto';
import { CreateDeliveryReceiptLineItemDto } from './dto/create-delivery-receipt.dto';

@Injectable()
export class LineItemsService {
  constructor(
    @InjectRepository(DeliveryReceiptLineItem)
    readonly deliveryReceiptLineItemRepository: Repository<DeliveryReceiptLineItem>,
  ) {}

  async getAll(
    deliveryReceiptId: number,
    pagination: PaginationQueryDto,
  ): Promise<DeliveryReceiptLineItem[]> {
    return this.deliveryReceiptLineItemRepository.find({
      where: {
        deliveryReceipt: {
          id: deliveryReceiptId,
        },
      },
      relations: ['purchaseOrderLineItem'],
      skip: pagination?.offset,
      take: pagination?.limit,
    });
  }

  async get(
    deliveryReceiptId: number,
    id: number,
  ): Promise<DeliveryReceiptLineItem> {
    const lineItem = await this.deliveryReceiptLineItemRepository.findOne({
      where: {
        id,
        deliveryReceipt: {
          id: deliveryReceiptId,
        },
      },
      relations: ['purchaseOrderLineItem'],
    });
    if (!lineItem)
      throw new NotFoundException(DeliveryReceiptLineItem.name, `${id}`);
    return lineItem;
  }

  async create(
    deliveryReceiptId: number,
    deliveryReceiptLineItemDto: CreateDeliveryReceiptLineItemDto,
  ): Promise<DeliveryReceiptLineItem> {
    const lineItemWithId = this.deliveryReceiptLineItemRepository.create({
      ...deliveryReceiptLineItemDto,
      deliveryReceipt: { id: deliveryReceiptId },
    });
    await this.deliveryReceiptLineItemRepository.save(lineItemWithId);
    return this.get(deliveryReceiptId, lineItemWithId.id);
  }

  async update(
    deliveryReceiptId: number,
    id: number,
    deliveryReceiptLineItemDto: UpdateDeliveryReceiptLineItemDto,
  ): Promise<DeliveryReceiptLineItem> {
    const lineItemWithId = await this.deliveryReceiptLineItemRepository.preload(
      {
        ...deliveryReceiptLineItemDto,
        deliveryReceipt: { id: deliveryReceiptId },
        id,
      },
    );
    if (!lineItemWithId)
      throw new NotFoundException(DeliveryReceiptLineItem.name, `${id}`);

    await this.deliveryReceiptLineItemRepository.save(lineItemWithId);
    return this.get(deliveryReceiptId, id);
  }

  async delete(
    purchaseOrderId: number,
    id: number,
  ): Promise<DeliveryReceiptLineItem> {
    const deliveryReceiptLineItem = await this.get(purchaseOrderId, id);
    if (!deliveryReceiptLineItem)
      throw new NotFoundException(DeliveryReceiptLineItem.name, `${id}`);
    await this.deliveryReceiptLineItemRepository.delete({ id });
    return deliveryReceiptLineItem;
  }
}
