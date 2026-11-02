import { Injectable } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InvoiceDto } from './dto/invoice.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from 'src/exceptions';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { DeliveryReceipt } from 'src/delivery-receipts/entities/delivery-receipt.entity';
import { uniq } from 'ramda';
import { JobOrder } from 'src/job-orders/entities/job-order.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(JobOrder)
    private jobOrderRepository: Repository<JobOrder>,
    @InjectRepository(DeliveryReceipt)
    private deliveryReceiptRepository: Repository<DeliveryReceipt>,
  ) {}

  async getAll(
    search?: string,
    pagination?: PaginationQueryDto,
  ): Promise<InvoiceDto[]> {
    if (!search)
      return this.invoiceRepository.find({
        select: {
          customer: {
            id: true,
            name: true,
          },
        },
        relations: {
          customer: true,
        },
        skip: pagination?.offset,
        take: pagination?.limit,
      });

    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.id::text LIKE :search OR invoice.notes LIKE :notes', {
        search: `${search}%`,
        notes: `%${search}%`,
      })
      .limit(pagination?.limit ?? 5)
      .offset(pagination?.offset ?? 0)
      .getMany();
  }

  async get(id: number): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        collection: true,
        deliveryReceipts: {
          purchaseOrder: true,
          lineItems: {
            purchaseOrderLineItem: true,
          },
        },
        jobOrders: {
          lineItems: true,
        },
      },
    });
    if (!invoice) throw new NotFoundException(Invoice.name, `${id}`);
    return invoice;
  }

  async create(invoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
    let drs: DeliveryReceipt[] = [];
    let jos: JobOrder[] = [];
    let amount = 0;
    let customerId: number = -1;
    if (invoiceDto.deliveryReceipts) {
      drs = await this.deliveryReceiptRepository.find({
        where: {
          id: In(invoiceDto.deliveryReceipts),
        },
        relations: {
          purchaseOrder: {
            customer: true,
          },
          lineItems: {
            purchaseOrderLineItem: true,
          },
        },
      });

      const customers = uniq(drs.map((dr) => dr.purchaseOrder.customer.id));
      amount = drs
        .flatMap((dr) => dr.lineItems)
        .reduce(
          (result, li) =>
            result + li.quantity * li.purchaseOrderLineItem.unitPrice,
          0,
        );
      if (customers.length > 1)
        throw new UnprocessableEntityException(
          Invoice.name,
          'Cannot create invoice from different customers',
        );

      customerId = customers[0];
    }

    if (invoiceDto.jobOrders) {
      jos = await this.jobOrderRepository.find({
        where: {
          id: In(invoiceDto.jobOrders),
        },
        relations: {
          customer: true,
          lineItems: true,
        },
      });

      const customers = uniq(jos.map((jo) => jo.customer.id));
      amount = jos
        .flatMap((jo) => jo.lineItems)
        .reduce((result, li) => result + li.quantity * li.unitPrice, 0);

      if (customers.length > 1)
        throw new UnprocessableEntityException(
          Invoice.name,
          'Cannot create invoice from different customers',
        );

      customerId = customers[0];
    }

    if (customerId === -1)
      throw new UnprocessableEntityException(
        Invoice.name,
        'Cannot create invoice from different customers',
      );

    const invoiceWithId = this.invoiceRepository.create({
      customer: {
        id: customerId,
      },
      createDate: invoiceDto.createDate,
      term: invoiceDto.dueInDays > 0 ? 'Charge' : 'Cash',
      status: 'Unpaid',
      notes: invoiceDto.notes,
      dueInDays: invoiceDto.dueInDays,
      deliveryReceipts: invoiceDto?.deliveryReceipts?.map((id) => {
        return { id };
      }),
      jobOrders: invoiceDto?.jobOrders?.map((id) => {
        return { id };
      }),
      amount,
    });

    return this.invoiceRepository.save(invoiceWithId);
  }
}
