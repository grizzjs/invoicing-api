import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async getAll(pagination?: PaginationQueryDto): Promise<PurchaseOrderDto[]> {
    return this.purchaseOrderRepository.find({
      relations: ['customer'],
      skip: pagination?.offset,
      take: pagination?.limit,
    });
  }

  async get(id: number): Promise<PurchaseOrderDto> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['lineItems', 'customer'],
    });
    if (!purchaseOrder) throw new NotFoundException(`${id}`);
    return purchaseOrder;
  }

  async create(purchaseOrder: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrderWithId =
      this.purchaseOrderRepository.create(purchaseOrder);
    return this.purchaseOrderRepository.save(purchaseOrderWithId);
  }

  async update(
    id: number,
    purchaseOrder: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderDto> {
    const purchaseOrderPreloaded = await this.purchaseOrderRepository.preload({
      id,
      ...purchaseOrder,
    });
    if (!purchaseOrderPreloaded) throw new NotFoundException(`${id}`);
    return this.purchaseOrderRepository.save(purchaseOrderPreloaded);
  }

  async cancel(id: number): Promise<PurchaseOrderDto> {
    return this.update(id, { status: 'cancelled' });
  }
}
