import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobOrderLineItem } from './entities/job-order-line-item.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { NotFoundException } from 'src/exceptions';
import { CreateJobOrderLineItemDto } from './dto/create-job-order.dto';
import { UpdateJobOrderLineItemDto } from './dto/update-job-order.dto';

@Injectable()
export class LineItemsService {
  constructor(
    @InjectRepository(JobOrderLineItem)
    readonly JobOrderLineItemRepository: Repository<JobOrderLineItem>,
  ) {}

  async getAll(
    jobOrderId: number,
    pagination: PaginationQueryDto,
  ): Promise<JobOrderLineItem[]> {
    return this.JobOrderLineItemRepository.find({
      where: {
        jobOrder: {
          id: jobOrderId,
        },
      },
      skip: pagination?.offset,
      take: pagination?.limit,
    });
  }

  async get(jobOrderId: number, id: number): Promise<JobOrderLineItem> {
    const lineItem = await this.JobOrderLineItemRepository.findOne({
      where: {
        id,
        jobOrder: {
          id: jobOrderId,
        },
      },
      relations: {
        jobOrder: {
          invoice: true,
        },
      },
    });
    if (!lineItem) throw new NotFoundException(JobOrderLineItem.name, `${id}`);
    return lineItem;
  }

  async create(
    jobOrderId: number,
    jobOrderLineItemDto: CreateJobOrderLineItemDto,
  ): Promise<JobOrderLineItem> {
    const lineItemWithId = this.JobOrderLineItemRepository.create({
      ...jobOrderLineItemDto,
      jobOrder: { id: jobOrderId },
    });
    await this.JobOrderLineItemRepository.save(lineItemWithId);
    return this.get(jobOrderId, lineItemWithId.id);
  }

  async update(
    jobOrderId: number,
    id: number,
    jobOrderLineItemDto: UpdateJobOrderLineItemDto,
  ): Promise<JobOrderLineItem> {
    const lineItemWithId = await this.JobOrderLineItemRepository.preload({
      ...jobOrderLineItemDto,
      jobOrder: { id: jobOrderId },
      id,
    });
    if (!lineItemWithId)
      throw new NotFoundException(JobOrderLineItem.name, `${id}`);

    await this.JobOrderLineItemRepository.save(lineItemWithId);
    return this.get(jobOrderId, id);
  }

  async delete(jobOrderId: number, id: number): Promise<JobOrderLineItem> {
    const jobOrderLineItem = await this.get(jobOrderId, id);
    await this.JobOrderLineItemRepository.delete({ id });
    return jobOrderLineItem;
  }
}
