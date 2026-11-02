import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { JobOrdersService } from './job-orders.service';
import { JobOrderDto } from './dto/job-order.dto';
import { GetAllQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { NotFoundException as HttpNotFoundException } from '@nestjs/common';
import { NotFoundException } from 'src/exceptions';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';

@Controller('job-orders')
export class JobOrdersController {
  constructor(private readonly JobOrdersService: JobOrdersService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'List of Job orders',
    type: [JobOrderDto],
  })
  async getJobOrders(
    @Query() { search, limit, offset }: GetAllQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JobOrderDto[]> {
    const count = await this.JobOrdersService.getCount();
    const all = await this.JobOrdersService.getAll(search, { limit, offset });
    res.set('X-Total-Count', count.toString());
    return all;
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Job order details',
    type: JobOrderDto,
  })
  async getJobOrder(@Param('id') id: number): Promise<JobOrderDto> {
    try {
      return await this.JobOrdersService.get(id);
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
    description: 'Job order created successfully',
    type: JobOrderDto,
  })
  @ApiBody({ type: CreateJobOrderDto })
  createJobOrder(@Body() body: CreateJobOrderDto): Promise<JobOrderDto> {
    return this.JobOrdersService.create(body);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Job order updated successfully',
    type: JobOrderDto,
  })
  @ApiBody({ type: UpdateJobOrderDto })
  updateJobOrder(
    @Param('id') id: number,
    @Body() body: UpdateJobOrderDto,
  ): Promise<JobOrderDto> {
    return this.JobOrdersService.update(id, body);
  }
}
