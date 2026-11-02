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
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JobOrderLineItemDto } from './dto/job-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LineItemsService } from './line-items.service';
import { CreateJobOrderLineItemDto } from './dto/create-job-order.dto';
import { UpdateJobOrderLineItemDto } from './dto/update-job-order.dto';

@Controller('job-orders/:jobOrderId/line-items')
export class LineItemsController {
  constructor(private readonly lineItemService: LineItemsService) {}
  @Get('/')
  @ApiOkResponse({
    description: 'List of Job orders line items',
    type: JobOrderLineItemDto,
  })
  async getLineItemsByJobOrder(
    @Param('jobOrderId') jobOrderId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<JobOrderLineItemDto[]> {
    return this.lineItemService.getAll(jobOrderId, pagination);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'List of Job orders line items',
    type: [JobOrderLineItemDto],
  })
  async getLineItemsByJobOrderAndId(
    @Param('jobOrderId') jobOrderId: number,
    @Param('id') id: number,
  ): Promise<JobOrderLineItemDto> {
    return this.lineItemService.get(jobOrderId, id);
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Job order line item created successfully',
    type: JobOrderLineItemDto,
  })
  @ApiBody({ type: CreateJobOrderLineItemDto })
  async createJobOrderLineItem(
    @Param('jobOrderId') jobOrderId: number,
    @Body() body: CreateJobOrderLineItemDto,
  ): Promise<JobOrderLineItemDto> {
    return this.lineItemService.create(jobOrderId, body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Job order line item created successfully',
    type: JobOrderLineItemDto,
  })
  @ApiBody({ type: UpdateJobOrderLineItemDto })
  async updateJobOrderLineItem(
    @Param('jobOrderId') jobOrderId: number,
    @Param('id') id: number,
    @Body() body: UpdateJobOrderLineItemDto,
  ): Promise<JobOrderLineItemDto> {
    return this.lineItemService.update(jobOrderId, id, body);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Job order line item deleted successfully',
    type: JobOrderLineItemDto,
  })
  async deleteJobOrderLineItem(
    @Param('jobOrderId') jobOrderId: number,
    @Param('id') id: number,
  ): Promise<JobOrderLineItemDto> {
    return this.lineItemService.delete(jobOrderId, id);
  }
}
