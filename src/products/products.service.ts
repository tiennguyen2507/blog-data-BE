import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { PRODUCT_NAME_MODEL, Product } from 'src/schemas/products.schema';
import { paginate, PaginationQuery, PaginationResult } from '../lib/pagination';

@Injectable()
export class ProductsService {
  constructor(@Inject(PRODUCT_NAME_MODEL) private readonly productsModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productsModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(query?: PaginationQuery): Promise<PaginationResult<Product>> {
    return paginate<Product>(this.productsModel, query);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsModel.findById(id).lean().exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productsModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productsModel.findByIdAndDelete(id).lean().exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return deletedProduct;
  }
}
