import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CollectionDto } from './dto/collection.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from 'src/exceptions';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async getAll(
    search?: string,
    pagination?: PaginationQueryDto,
  ): Promise<CollectionDto[]> {
    if (!search)
      return this.collectionRepository.find({
        relations: {
          customer: true,
          invoices: true,
        },
        skip: pagination?.offset,
        take: pagination?.limit,
      });

    return this.collectionRepository
      .createQueryBuilder('collection')
      .where(
        'collection.id::text LIKE :search OR collection.notes LIKE :notes',
        { search: `${search}%`, notes: `%${search}%` },
      )
      .limit(pagination?.limit ?? 5)
      .offset(pagination?.offset ?? 0)
      .getMany();
  }

  async get(id: number): Promise<CollectionDto> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        invoices: true,
      },
    });
    if (!collection) throw new NotFoundException(Collection.name, `${id}`);
    return collection;
  }

  async create(collectionDto: CreateCollectionDto): Promise<CollectionDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const collection = this.collectionRepository.create({
        ...collectionDto,
        customer: { id: collectionDto.customer },
        invoices: collectionDto.invoices.map((invoiceId) => ({
          id: invoiceId,
        })),
      });
      console.log('collection', collection);
      await queryRunner.manager.save(collection);

      collection.invoices.forEach((invoice) => (invoice.status = 'Paid'));
      await queryRunner.manager.update(
        Invoice,
        collection.invoices.map((invoice) => invoice.id),
        {
          status: 'Paid',
        },
      );

      await queryRunner.commitTransaction();
      return collection;
    } catch (e) {
      // TODO: telemetry
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(Collection.name);
    } finally {
      await queryRunner.release();
    }
  }
}
