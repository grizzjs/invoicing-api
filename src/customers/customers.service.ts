import { Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { NotFoundException } from 'src/exceptions';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCount(options?: FindManyOptions<Customer>): Promise<number> {
    return this.customerRepository.count(options);
  }
  async getAll(
    search?: string,
    pagination?: PaginationQueryDto,
  ): Promise<CustomerDto[]> {
    if (!search)
      return this.customerRepository.find({
        skip: pagination?.offset,
        take: pagination?.limit,
      });

    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id::text LIKE :search', { search: `${search}%` })
      .limit(pagination?.limit ?? 5)
      .offset(pagination?.offset ?? 0)
      .getMany();
  }

  async get(id: number): Promise<CustomerDto> {
    const customer = await this.customerRepository
      .createQueryBuilder('customers')
      .leftJoinAndSelect(
        'customers.invoices',
        'invoice',
        'invoice.status = :status',
        { status: 'Unpaid' },
      )
      .where({
        id,
      })
      .getOne();
    if (!customer) throw new NotFoundException(Customer.name, `${id}`);
    return customer;
  }

  async create(customer: CreateCustomerDto): Promise<CustomerDto> {
    const customerWithId = this.customerRepository.create(customer);
    return this.customerRepository.save(customerWithId);
  }

  async update(id: number, customer: UpdateCustomerDto): Promise<CustomerDto> {
    const customerPreloaded = await this.customerRepository.preload({
      id,
      ...customer,
    });
    if (!customerPreloaded) throw new NotFoundException(Customer.name, `${id}`);
    return this.customerRepository.save(customerPreloaded);
  }
}
