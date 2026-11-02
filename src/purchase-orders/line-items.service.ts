import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { NotFoundException } from 'src/exceptions';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order.dto';

@Injectable()
export class LineItemsService {
  constructor(
    @InjectRepository(PurchaseOrderLineItem)
    readonly purchaseOrderLineItemRepository: Repository<PurchaseOrderLineItem>,
  ) {}

  async getAll(
    purchaseOrderId: number,
    pagination: PaginationQueryDto,
  ): Promise<PurchaseOrderLineItem[]> {
    return this.purchaseOrderLineItemRepository.find({
      where: {
        purchaseOrder: {
          id: purchaseOrderId,
        },
      },
      skip: pagination?.offset,
      take: pagination?.limit,
    });
  }

  async get(
    purchaseOrderId: number,
    id: number,
  ): Promise<PurchaseOrderLineItem> {
    const lineItem = await this.purchaseOrderLineItemRepository.findOne({
      where: {
        id,
        purchaseOrder: {
          id: purchaseOrderId,
        },
      },
      relations: {
        deliveries: {
          deliveryReceipt: {
            invoice: true,
          },
        },
      },
    });
    if (!lineItem)
      throw new NotFoundException(PurchaseOrderLineItem.name, `${id}`);
    return lineItem;
  }

  async create(
    purchaseOrderId: number,
    purchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto,
  ): Promise<PurchaseOrderLineItem> {
    const lineItemWithId = this.purchaseOrderLineItemRepository.create({
      ...purchaseOrderLineItemDto,
      purchaseOrder: { id: purchaseOrderId },
    });
    await this.purchaseOrderLineItemRepository.save(lineItemWithId);
    return this.get(purchaseOrderId, lineItemWithId.id);
  }

  async update(
    purchaseOrderId: number,
    id: number,
    purchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto,
  ): Promise<PurchaseOrderLineItem> {
    const lineItemWithId = await this.purchaseOrderLineItemRepository.preload({
      ...purchaseOrderLineItemDto,
      purchaseOrder: { id: purchaseOrderId },
      id,
    });
    if (!lineItemWithId)
      throw new NotFoundException(PurchaseOrderLineItem.name, `${id}`);

    await this.purchaseOrderLineItemRepository.save(lineItemWithId);
    return this.get(purchaseOrderId, id);
  }

  async delete(
    purchaseOrderId: number,
    id: number,
  ): Promise<PurchaseOrderLineItem> {
    const purchaseOrderLineItem = await this.get(purchaseOrderId, id);
    await this.purchaseOrderLineItemRepository.delete({ id });
    return purchaseOrderLineItem;
  }
}
