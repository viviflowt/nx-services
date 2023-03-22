import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import f from 'lodash/fp';
import { PaginationOptions } from '../interfaces/pagination-options.interface';
import { OrderOptions } from '../types/order-options';

export class PaginatedQueryOptions<Entity>
  implements PaginationOptions<Entity>
{
  @ApiPropertyOptional({
    description: 'Page number at least 1',
    default: 1,
  })
  @ValidateIf(f.negate(f.isNil))
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({
    description: 'Limit the number of items per page',
    default: 10,
  })
  @ValidateIf(f.negate(f.isNil))
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Field name(s) to sort by. Prefix with "+" for ascending order, "-" for descending order. Default is ascending order.',
    default: ['createdAt'],
  })
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  order: OrderOptions<Entity> = [];
}
