import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, description: 'Limit for pagination' })
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty({ required: false, description: 'Offset for pagination' })
  @IsOptional()
  @IsPositive()
  offset: number;
}

export class SearchQueryDto {
  @ApiProperty({ required: false, description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search: string;
}

export class GetAllQueryDto extends IntersectionType(
  PaginationQueryDto,
  SearchQueryDto,
) {}
