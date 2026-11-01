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

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
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
      },
    });
    if (!invoice) throw new NotFoundException(Invoice.name, `${id}`);
    return invoice;
  }

  async create(invoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
    const drs = await this.deliveryReceiptRepository.find({
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
    const amount = drs
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

    const invoiceWithId = this.invoiceRepository.create({
      customer: {
        id: customers[0],
      },
      createDate: invoiceDto.createDate,
      term: invoiceDto.dueInDays > 0 ? 'Charge' : 'Cash',
      status: 'Unpaid',
      dueInDays: invoiceDto.dueInDays,
      deliveryReceipts: invoiceDto.deliveryReceipts.map((id) => {
        return { id };
      }),
      amount,
    });

    return this.invoiceRepository.save(invoiceWithId);
  }
}
