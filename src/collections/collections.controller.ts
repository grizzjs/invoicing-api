import {
  Controller,
  Get,
  NotFoundException as HttpNotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionDto } from './dto/collection.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { NotFoundException } from 'src/exceptions';
import { GetAllQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  // @Post()
  // create(@Body() createCollectionDto: CreateCollectionDto) {
  //   return this.collectionsService.create(createCollectionDto);
  // }

  @Get()
  @ApiOkResponse({
    description: 'List of collections',
    type: [CollectionDto],
  })
  getCollections(
    @Query() { search, limit, offset }: GetAllQueryDto,
  ): Promise<CollectionDto[]> {
    return this.collectionsService.getAll(search, { limit, offset });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Collection details',
    type: CollectionDto,
  })
  async getCollection(@Param('id') id: number) {
    try {
      return await this.collectionsService.get(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new HttpNotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }
}
