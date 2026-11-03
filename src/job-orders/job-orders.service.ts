import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobOrder } from './entities/job-order.entity';
import { Brackets, DataSource, FindManyOptions, Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';
import { JobOrderDto } from './dto/job-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { assoc, dissoc, map, pipe, prop } from 'ramda';
import { JobOrderLineItem } from './entities/job-order-line-item.entity';

@Injectable()
export class JobOrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(JobOrder)
    private jobOrderRepository: Repository<JobOrder>,
    @InjectRepository(JobOrderLineItem)
    private jobOrderLineItemRepository: Repository<JobOrderLineItem>,
  ) {}

  async getCount(options?: FindManyOptions<JobOrder>): Promise<number> {
    return this.jobOrderRepository.count(options);
  }

  async getAll(
    search?: string,
    pagination?: PaginationQueryDto,
  ): Promise<JobOrderDto[]> {
    if (!search)
      return this.jobOrderRepository.find({
        relations: {
          customer: true,
          invoice: true,
          lineItems: true,
        },
        skip: pagination?.offset,
        take: pagination?.limit,
      });

    return this.jobOrderRepository
      .createQueryBuilder('job_order')
      .leftJoinAndSelect('job_order.customer', 'customer')
      .leftJoinAndSelect('job_order.invoice', 'invoice')
      .leftJoinAndSelect('job_order.lineItems', 'line_items')
      .where(
        new Brackets((qb) => {
          qb.where('job_order.id::text ILIKE :search', { search: `${search}%` })
            .orWhere('job_order.notes ILIKE :notes', { notes: `%${search}%` })
            .orWhere('line_items.name ILIKE :notes', {
              notes: `%${search}%`,
            })
            .orWhere('line_items.description ILIKE :notes', {
              notes: `%${search}%`,
            });
        }),
      )
      .take(pagination?.limit ?? 5)
      .skip(pagination?.offset ?? 0)
      .getMany();
  }

  async get(id: number): Promise<JobOrderDto> {
    const jobOrder = await this.jobOrderRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        invoice: true,
        lineItems: true,
      },
    });
    if (!jobOrder) throw new NotFoundException(JobOrder.name, `${id}`);
    return jobOrder;
  }

  async create(jobOrderDto: CreateJobOrderDto): Promise<JobOrderDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lineItemDtos = prop('lineItems', jobOrderDto);
      //const customerId = prop('customerId', JobOrderDto);
      const jobOrderWithId = this.jobOrderRepository.create(
        pipe(
          dissoc('lineItems'),
          //assoc('customer', { id: customerId }),
        )(jobOrderDto),
      );
      const jobOrder = await queryRunner.manager.save(jobOrderWithId);
      const lineItemDtosWithJobOrderId = map(
        assoc('jobOrder', jobOrder),
        lineItemDtos,
      );
      const jobLineItemsWithId = this.jobOrderLineItemRepository.create(
        lineItemDtosWithJobOrderId,
      );
      await queryRunner.manager.save(jobLineItemsWithId);
      await queryRunner.commitTransaction();
      return this.get(jobOrder.id);
    } catch (e) {
      // TODO: telemetry
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(JobOrder.name);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, jobOrder: UpdateJobOrderDto): Promise<JobOrderDto> {
    const jobOrderPreloaded = await this.jobOrderRepository.preload({
      id,
      ...jobOrder,
    });
    if (!jobOrderPreloaded) throw new NotFoundException(JobOrder.name, `${id}`);
    await this.jobOrderRepository.save(jobOrderPreloaded);
    return this.get(id);
  }
}
