import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Brackets, DataSource, FindManyOptions, Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { assoc, dissoc, map, pipe, prop } from 'ramda';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLineItem)
    private purchaseOrderLineItemRepository: Repository<PurchaseOrderLineItem>,
  ) {}

  async getCount(options?: FindManyOptions<PurchaseOrder>): Promise<number> {
    return this.purchaseOrderRepository.count(options);
  }

  async getAll(
    search?: string,
    pagination?: PaginationQueryDto,
  ): Promise<PurchaseOrderDto[]> {
    if (!search)
      return this.purchaseOrderRepository.find({
        select: {
          deliveryReceipts: {
            id: true,
            invoice: {
              id: true,
            },
            status: true,
          },
        },
        relations: {
          customer: true,
          lineItems: {
            deliveries: true,
          },
          deliveryReceipts: {
            invoice: true,
          },
        },
        skip: pagination?.offset,
        take: pagination?.limit,
      });

    return this.purchaseOrderRepository
      .createQueryBuilder('purchase_order')
      .leftJoin('purchase_order.lineItems', 'purchase_order_line_item')
      .where(
        new Brackets((qb) => {
          qb.where('purchase_order.id::text ILIKE :search', {
            search: `${search}%`,
          })
            .orWhere('purchase_order.notes ILIKE :notes', {
              notes: `%${search}%`,
            })
            .orWhere('purchase_order_line_item.name ILIKE :notes', {
              notes: `%${search}%`,
            })
            .orWhere('purchase_order_line_item.description ILIKE :notes', {
              notes: `%${search}%`,
            });
        }),
      )
      .distinct(true)
      .take(pagination?.limit ?? 5)
      .skip(pagination?.offset ?? 0)
      .getMany();
  }

  async get(id: number): Promise<PurchaseOrderDto> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: {
        customer: true,

        lineItems: {
          deliveries: {
            deliveryReceipt: {
              invoice: true,
            },
            purchaseOrderLineItem: true,
          },
        },
      },
    });
    if (!purchaseOrder)
      throw new NotFoundException(PurchaseOrder.name, `${id}`);
    return purchaseOrder;
  }

  async create(
    purchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrderDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lineItemDtos = prop('lineItems', purchaseOrderDto);
      //const customerId = prop('customerId', purchaseOrderDto);
      const purchaseOrderWithId = this.purchaseOrderRepository.create(
        pipe(
          dissoc('lineItems'),
          //assoc('customer', { id: customerId }),
        )(purchaseOrderDto),
      );
      const purchaseOrder = await queryRunner.manager.save(purchaseOrderWithId);

      const lineItemDtosWithPurchaseOrderId = map(
        assoc('purchaseOrder', purchaseOrder),
        lineItemDtos,
      );
      const purchaseLineItemsWithId =
        this.purchaseOrderLineItemRepository.create(
          lineItemDtosWithPurchaseOrderId,
        );
      await queryRunner.manager.save(purchaseLineItemsWithId);
      await queryRunner.commitTransaction();
      return this.get(purchaseOrder.id);
    } catch (e) {
      // TODO: telemetry
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(PurchaseOrder.name);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    purchaseOrder: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrderDto> {
    const purchaseOrderPreloaded = await this.purchaseOrderRepository.preload({
      id,
      ...purchaseOrder,
    });
    if (!purchaseOrderPreloaded)
      throw new NotFoundException(PurchaseOrder.name, `${id}`);
    await this.purchaseOrderRepository.save(purchaseOrderPreloaded);
    return this.get(id);
  }
}
