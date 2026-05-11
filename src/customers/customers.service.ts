import { Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { NotFoundException } from 'src/exceptions';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private customers: Customer[] = [
    {
      id: 1,
      name: 'Northtrop',
      address: '359 McArthur Hi-way, Brgy. Corazon, Calumpit, Bulacan',
      phoneNumber: '09175179241',
      email: 'northrop@gmail.com',
      tin: '446-160-170-000',
    },
  ];

  getAll(pagination?: { limit?: number; offset?: number }): CustomerDto[] {
    console.log(pagination);
    return this.customers;
  }

  get(id: number): CustomerDto {
    const customer = this.customers.find((customer) => customer.id == id);
    if (!customer) throw new NotFoundException(`${id}`);
    return customer;
  }

  create(customer: CreateCustomerDto): CustomerDto {
    const customerWithId = {
      id: Math.random(),
      ...customer,
    } as CustomerDto;
    this.customers.push(customerWithId);
    return customerWithId;
  }

  update(id: number, customer: UpdateCustomerDto): CustomerDto {
    const index = this.customers.findIndex((customer) => customer.id == id);
    if (index < 0) throw new NotFoundException(`${id}`);
    this.customers[index] = { ...this.customers[index], ...customer };
    return this.customers[index];
  }

  remove(id: number): CustomerDto {
    const index = this.customers.findIndex((customer) => customer.id == id);
    const customer = this.customers[index];
    if (index < 0) throw new NotFoundException(`${id}`);

    this.customers = this.customers.toSpliced(index, 1);
    return customer;
  }
}
