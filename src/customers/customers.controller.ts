import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { NotFoundException } from 'src/exceptions';
import { NotFoundException as HttpNotFoundException } from '@nestjs/common';
import { CustomerDto } from './dto/customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GetAllQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/')
  @ApiOkResponse({ description: 'List of customers', type: [CustomerDto] })
  async getCustomers(
    @Query() { search, limit, offset }: GetAllQueryDto,
  ): Promise<CustomerDto[]> {
    return this.customersService.getAll(search, { limit, offset });
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Customer details', type: CustomerDto })
  async getCustomer(@Param('id') id: number): Promise<CustomerDto> {
    try {
      return await this.customersService.get(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new HttpNotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Customer created successfully',
    type: CustomerDto,
  })
  @ApiBody({ type: CreateCustomerDto })
  createCustomer(@Body() body: CreateCustomerDto): Promise<CustomerDto> {
    return this.customersService.create(body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Customer updated successfully',
    type: CustomerDto,
  })
  @ApiBody({ type: UpdateCustomerDto })
  updateCustomer(
    @Param('id') id: number,
    @Body() body: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    return this.customersService.update(id, body);
  }
}
