import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CollectionDto } from './dto/collection.dto';
import { NotFoundException } from 'src/exceptions';

@Injectable()
export class CollectionsService {
  constructor(
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
      .createQueryBuilder('delivery_receipt')
      .where('delivery_receipt.id::text LIKE :search', { search: `${search}%` })
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
}
