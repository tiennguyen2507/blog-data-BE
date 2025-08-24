import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterOrderDto {
  @ApiProperty({
    description: 'Search by customer name or phone',
    example: 'Nguyen Van A',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by order status',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    example: 'pending',
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
