import {
  Body,
  Controller,
  Get,
  NotFoundException as HttpNotFoundException,
  Param,
  Post,
  Query,
  UnprocessableEntityException as HttpUnprocessableEntityException,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { InvoiceDto } from './dto/invoice.dto';
import { GetAllQueryDto } from 'src/common/dto/pagination-query.dto';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from 'src/exceptions';

@Controller('invoices')
export class InvoicesController {
  constructor(readonly invoiceService: InvoicesService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'List of invoices',
    type: [InvoiceDto],
  })
  getInvoices(
    @Query() { search, limit, offset }: GetAllQueryDto,
  ): Promise<InvoiceDto[]> {
    return this.invoiceService.getAll(search, { limit, offset });
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Invoice details',
    type: InvoiceDto,
  })
  async getInvoice(@Param('id') id: number): Promise<InvoiceDto> {
    try {
      return await this.invoiceService.get(id);
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
    description: 'Invoice details',
    type: InvoiceDto,
  })
  @ApiBody({ type: CreateInvoiceDto })
  async createInvoice(@Body() body: CreateInvoiceDto): Promise<InvoiceDto> {
    try {
      return await this.invoiceService.create(body);
    } catch (error: unknown) {
      if (error instanceof UnprocessableEntityException) {
        throw new HttpUnprocessableEntityException(error.message);
      } else {
        throw error;
      }
    }
  }
}
