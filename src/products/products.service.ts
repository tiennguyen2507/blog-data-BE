import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { PRODUCT_NAME_MODEL, Product } from 'src/schemas/products.schema';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_NAME_MODEL) private productsModel: Model<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = new this.productsModel(createProductDto);
    return product.save();
  }

  findAll() {
    return this.productsModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${updateProductDto} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
