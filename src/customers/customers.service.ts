import { Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { NotFoundException } from 'src/exceptions';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getAll(pagination?: PaginationQueryDto): Promise<CustomerDto[]> {
    return this.customerRepository.find({
      skip: pagination?.offset,
      take: pagination?.limit,
    });
  }

  async get(id: number): Promise<CustomerDto> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`${id}`);
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
    if (!customerPreloaded) throw new NotFoundException(`${id}`);
    return this.customerRepository.save(customerPreloaded);
  }

  async remove(id: number): Promise<CustomerDto> {
    const customer = await this.get(id);
    return this.customerRepository.remove(customer);
  }
}
