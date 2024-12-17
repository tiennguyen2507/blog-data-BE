import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray({ each: true })
  sizes: {
    size: 'S' | 'M' | 'L';
    price: number;
    sales: number;
    image: string[];
  }[];

  @ApiProperty({
    enum: ['bakery', 'accessory', 'other'],
    default: 'bakery',
  })
  @IsNotEmpty()
  @IsEnum(['bakery', 'accessory', 'other'])
  category: 'bakery' | 'accessory' | 'other';
}
