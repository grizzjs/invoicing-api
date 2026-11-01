import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  NotFoundException,
  UnprocessableEntityException,
} from 'src/exceptions';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

import { DeliveryReceipt } from './entities/delivery-receipt.entity';
import { CreateDeliveryReceiptDto } from './dto/create-delivery-receipt.dto';
import { DeliveryReceiptDto } from './dto/delivery-receipt.dto';
import { UpdateDeliveryReceiptDto } from './dto/update-delivery-receipt.dto';
import { DeliveryState } from './entities/delivery-states.entity';
import { assoc, dissoc, map, prop } from 'ramda';
import { DeliveryReceiptLineItem } from './entities/delivery-receipt-line-item.entity';

@Injectable()
export class DeliveryReceiptsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(DeliveryReceipt)
    private deliveryReceiptRepository: Repository<DeliveryReceipt>,
    @InjectRepository(DeliveryReceiptLineItem)
    private deliveryReceiptLineItemRepository: Repository<DeliveryReceiptLineItem>,
    @InjectRepository(DeliveryState)
    private deliveryStateRepository: Repository<DeliveryState>,
  ) {}

  async getAll(
    search?: string,
    pagination?: PaginationQueryDto,
  ): Promise<DeliveryReceiptDto[]> {
    if (!search)
      return this.deliveryReceiptRepository.find({
        relations: {
          purchaseOrder: {
            customer: true,
          },
        },
        skip: pagination?.offset,
        take: pagination?.limit,
      });

    return this.deliveryReceiptRepository
      .createQueryBuilder('delivery_receipt')
      .where(
        'delivery_receipt.id::text LIKE :search OR delivery_receipt.notes LIKE :notes',
        { search: `${search}%`, notes: `%${search}%` },
      )
      .limit(pagination?.limit ?? 5)
      .offset(pagination?.offset ?? 0)
      .getMany();
  }

  async get(id: number): Promise<DeliveryReceiptDto> {
    const deliveryReceipt = await this.deliveryReceiptRepository.findOne({
      where: { id },
      relations: {
        purchaseOrder: {
          customer: true,
        },
        lineItems: {
          purchaseOrderLineItem: true,
        },
        states: true,
      },
    });
    if (!deliveryReceipt)
      throw new NotFoundException(DeliveryReceipt.name, `${id}`);
    return deliveryReceipt;
  }

  async update(
    id: number,
    deliveryReceiptDto: UpdateDeliveryReceiptDto,
  ): Promise<DeliveryReceiptDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deliveryReceiptPreloaded =
        await this.deliveryReceiptRepository.preload({
          id,
          status: deliveryReceiptDto.status,
        });
      if (!deliveryReceiptPreloaded)
        throw new NotFoundException(DeliveryReceipt.name, `${id}`);
      const deliveryStateModel = this.deliveryStateRepository.create({
        status: deliveryReceiptDto.status,
        date: new Date(),
        deliveryReceipt: {
          id,
        },
      });

      await this.deliveryReceiptRepository.save(deliveryReceiptPreloaded);
      await this.deliveryStateRepository.save(deliveryStateModel);
      const deliveryReceipt = this.get(id);
      await queryRunner.commitTransaction();
      return deliveryReceipt;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(DeliveryReceipt.name);
    } finally {
      await queryRunner.release();
    }
  }

  async create(
    createDeliveryReceiptDto: CreateDeliveryReceiptDto,
  ): Promise<DeliveryReceiptDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lineItemDtos = prop('lineItems', createDeliveryReceiptDto);

      const deliveryReceiptWithId = this.deliveryReceiptRepository.create({
        ...dissoc('lineItems', createDeliveryReceiptDto),
        status: 'New',
      });
      const deliveryReceipt = await queryRunner.manager.save(
        deliveryReceiptWithId,
      );

      const newDeliveryStateModel = this.deliveryStateRepository.create(
        assoc('deliveryReceipt', deliveryReceipt, {
          status: 'New' as const,
          date: createDeliveryReceiptDto.createDate,
        }),
      );

      await queryRunner.manager.save(newDeliveryStateModel);

      const lineItemDtosWithDeliveryReceiptId = map(
        assoc('deliveryReceipt', deliveryReceipt),
        lineItemDtos,
      );
      const deliveryReceiptLineItemsWithId =
        this.deliveryReceiptLineItemRepository.create(
          lineItemDtosWithDeliveryReceiptId,
        );
      await queryRunner.manager.save(deliveryReceiptLineItemsWithId);
      await queryRunner.commitTransaction();
      return this.get(deliveryReceiptWithId.id);
    } catch (e) {
      // TODO: telemetry
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(DeliveryReceipt.name);
    } finally {
      await queryRunner.release();
    }
  }
}
