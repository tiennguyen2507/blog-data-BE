import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength, IsNumber, Min, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Delicious Chocolate Cake',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Product description',
    example: 'A rich and moist chocolate cake made with premium ingredients',
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 25.99,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Number of sales',
    example: 150,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  sales: number;

  @ApiProperty({
    description: 'Product category',
    example: 'bakery',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Product thumbnail image URL',
    example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/cake-thumbnail.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  thumbnail: string;

  @ApiProperty({
    description: 'Available quantity in stock',
    example: 50,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
