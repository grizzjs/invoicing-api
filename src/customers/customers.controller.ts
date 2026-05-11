import {
  Body,
  Controller,
  Delete,
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

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/')
  getCustomers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): CustomerDto[] {
    return this.customersService.getAll({ limit, offset });
  }

  @Get('/:id')
  getCustomer(@Param('id') id: number): CustomerDto {
    try {
      return this.customersService.get(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new HttpNotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Post('/')
  createCustomer(@Body() body: CreateCustomerDto): CustomerDto {
    return this.customersService.create(body);
  }

  @Patch('/:id')
  updateCustomer(
    @Param('id') id: number,
    @Body() body: UpdateCustomerDto,
  ): CustomerDto {
    return this.customersService.update(id, body);
  }

  @Delete('/:id')
  deleteCustomer(@Param('id') id: number): CustomerDto {
    return this.customersService.remove(id);
  }
}
