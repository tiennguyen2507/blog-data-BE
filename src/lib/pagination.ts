import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  nextPage: boolean;
  prePage: boolean;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export async function paginate<T = any>(
  model: any,
  query: PaginationQuery = {},
  filter: any = {},
  projection: any = null,
  options: any = {},
): Promise<PaginationResult<T>> {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model
      .find(filter, projection, { ...options, skip, limit })
      .lean()
      .exec(),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    nextPage: page < totalPages,
    prePage: page > 1,
  };
}
